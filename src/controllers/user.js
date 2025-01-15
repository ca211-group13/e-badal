import { JWT_SECRET_KEY } from "../config/dotenv.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import transaction from "../models/transaction.js";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Find user by email or phone number
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check password
    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

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
      const users = await User.find();
      res.json({ success: true, users });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


// Create admin (only for owner)
export const createAdmin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, password, phoneNumber } = req.body;

    const owner = await User.findById(userId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Admin already exists with this email",
        });
    }

    const newAdmin = new User({
      name,
      email,
      password,
      phoneNumber,
      role: "admin",
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove admin(Only owner can remove admin)
export const removeAdmin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { adminId } = req.params; // Get adminId from URL params

    const owner = await User.findById(userId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const admin = await User.findById(adminId);
    if (admin.role === "owner") {
      return res
        .status(404)
        .json({ success: false, message: "Owner Can't be deleted" });
    }
    if (!admin || admin.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    await User.findByIdAndDelete(adminId);
    res.json({ success: true, message: "Admin removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get users all - GET
export const getAdmins = async (req, res) => {
  try {
    // Fetch users with roles of either "admin" or "owner"
    const admins = await User.find({ role: { $in: ["admin", "owner"] } }).sort({
      createdAt: -1,
    });

    if (admins.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Oops! Admins not found." });
    }

    res.status(200).json({
      status: "success",
      result: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
