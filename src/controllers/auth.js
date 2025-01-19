import { JWT_SECRET_KEY } from "../config/dotenv.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
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

    // Find user by email
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

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create admin (only for owner)
export const createAdmin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, password, phoneNumber } = req.body;

    const owner = await User.findById(userId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
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

// Remove admin (Only owner can remove admin)
export const removeAdmin = async (req, res) => {
  try {
    const { userId } = req.user;
    const { adminId } = req.params;

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

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "owner"] } })
      .select("-password")
      .sort({ createdAt: -1 });

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Oops! Admins not found.",
      });
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
