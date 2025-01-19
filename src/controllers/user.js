import { JWT_SECRET_KEY } from "../config/dotenv.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import transaction from "../models/transaction.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch the user, excluding the password field
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if transaction history exists
    const { transactionHistory } = user;
    let isTherePendingTransaction = false;
    let lastPendingTransaction = null;

    if (transactionHistory && transactionHistory.length > 0) {
      // Assuming each transaction has a status field and a timestamp field (createdAt)
      const transactions = await transaction.find({
        _id: { $in: transactionHistory }, // Query transactions based on their IDs
      });

      const pendingTransactions = transactions.filter(
        (txn) => txn.status === "Pending"
      );

      // If there's any pending transaction, get the last one based on time
      if (pendingTransactions.length > 0) {
        isTherePendingTransaction = true;

        // Sort pending transactions by date and take the latest one
        lastPendingTransaction = pendingTransactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
      }
    }
    let lastTransactionStatus = user.lastTransactionStatus;

    // Clear the lastTransactionStatus after it's fetched
    user.lastTransactionStatus = null;
    await user.save();

    // Respond with user details and the pending transaction status
    res.json({
      success: true,
      user,
      isTherePendingTransaction,
      lastPendingTransaction,
      lastTransactionStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user; // Get the user ID from the request
    const { name, email, phoneNumber } = req.body; // Destructure the request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user fields if they are provided
    if (name) user.name = name;
    if (email) {
      // Optionally check if the email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already in use" });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Save the updated user details
    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user; // Get the user ID from the request

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    console.log(user);
    if (user.role == "user") {
      return res.status(403).json({ success: false, message: "un othrized" });
    }

    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
