import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import User from '../models/user.js'

// Create a New Transaction
export const createTransaction = async (req, res) => {
    try {
      const { evcPhoneNumber, sahalPhoneNumber, zaadPhoneNumber, usdtAddress, amount, type, fee, chainType } = req.body;
  
      const { userId } = req.user; // Get the authenticated user ID
  
      // Validate the chain type
      const validChains = ["BEP-20", "TRC-20"];
      if (!validChains.includes(chainType)) {
        return res.status(400).json({ success: false, message: "Invalid chain type" });
      }
  
      // Determine local account type and validate
      let localPhoneNumber, localAccountType;
      if (type === "USDT to EVC" || type === "EVC to USDT") {
        localPhoneNumber = evcPhoneNumber;
        localAccountType = "EVC";
      } else if (type === "USDT to Zaad" || type === "Zaad to USDT") {
        localPhoneNumber = zaadPhoneNumber;
        localAccountType = "Zaad";
      } else if (type === "USDT to Sahal" || type === "Sahal to USDT") {
        localPhoneNumber = sahalPhoneNumber;
        localAccountType = "Sahal";
      } else {
        return res.status(400).json({ success: false, message: "Invalid swap type" });
      }
  
      // Validate local phone number
      if (!localPhoneNumber) {
        return res.status(400).json({
          success: false,
          message: `For the ${type} swap, you must provide a valid ${localAccountType} phone number.`,
        });
      }
  
      // Create the transaction
      const transaction = new Transaction({
        user: userId,
        usdtAddress,
        chainType,
        amount,
        fee,
        type,
        localPhoneNumber,
      });
      
      await transaction.save();
  
      // Add the transaction to the user's history
      const user = await User.findById(userId);
      user.transactionHistory.push(transaction._id);
      await user.save();
  
      return res.json({ success: true, message: "Transaction created", transaction });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
  

export const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;
        const { userId } = req.user;

        // Validate if transactionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ success: false, message: "Invalid Transaction ID" });
        }

        const user = await User.findById(userId);

        if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        // Update user's lastTransactionStatus
        const transactionUser = await User.findById(transaction.user);
        transactionUser.lastTransactionStatus = status === 'Success' ? 'success' : (status === 'Failed' ? 'failed' : null);
        await transactionUser.save();

        res.json({ success: true, message: "Transaction status updated", transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getAllTransactions = async (req, res) => {
    try {
        const { userId } = req.user;
        const { page, limit, status } = req.query;

        // Check if the user exists and is authorized
        const user = await User.findById(userId);
        if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Pagination options
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 },
            populate: { path: 'user', select: 'name email' }, // Populating user information (name, email)
        };

        // Building the query
        let query = {};
        if (status) {
            query.status = status;
        }

        // Fetch transactions with pagination and user info
        const result = await Transaction.paginate(query, options);

        res.json({
            success: true,
            transactions: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            totalTransactions: result.totalDocs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Transaction Analytics
export const getTransactionAnalytics = async (req, res) => {
    try {
        const { userId } = req.user;  // Assuming the authenticated user is admin or owner
        const user = await User.findById(userId);

        if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Fetch all transactions
        const allTransactions = await Transaction.find();

        // Calculate total amount and total service fee (1% of each transaction amount)
        const totalAmount = allTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        const serviceFee = allTransactions.reduce((acc, transaction) => acc + transaction.fee, 0);

        res.json({
            success: true,
            totalAmount,      // Total amount of all transactions
            serviceFee,       // Total profit from the 1% service fee
            totalTransactions: allTransactions.length,
            allTransactions: allTransactions,
            message: 'Analytics data retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.user;  // Get the authenticated user ID from the JWT middleware

        const { status } = req.query;

        // Build the query to find transactions for the authenticated user
        let query = { user: userId };
        if (status) {
            query.status = status;  // Optionally filter by transaction status if provided
        }

        // Find all transactions for the authenticated user
        const transactions = await Transaction.find(query).sort({ createdAt: -1 });  // Sort by creation date (newest first)

        res.json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
