import { JWT_SECRET_KEY } from "../config/dotenv.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const registerUser = async (req, res) => {
  try {
      const { name, email,  password,  role } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, message: "User already exists" });
      }
      
      // Create new user
      const user = new User({ name, email, password, role });
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      
      res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getUsers=async(req,res)=>{
    try{

        const users=await User.find();
        res.status(200).json(users);
    }catch(error){
        console.log(error)
        res.send(500).json({message:"internal server error"})
    }

}


export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Validate input
      if (!email) {
          return res.status(400).json({ success: false, message: "Email is required" });
      }

      // Find user by email or phone number
     const user = await User.findOne({ email });
      
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
      // Check password
      const isMatch = await user.comparePassword(password, user.password);
      
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

      res.json({ success: true, message: "Login successful", token });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



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
      const transactions = await Transaction.find({
        _id: { $in: transactionHistory } // Query transactions based on their IDs
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
      lastTransactionStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};