import { JWT_SECRET_KEY } from "../config/dotenv.js";
// removing double s json //
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const registerUser = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    console.log(name,"name")

    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    

    // Generate JWT token
    const token = jwt.sign({ userId: user._id ,role:user.role}, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const loginUser = async (req, res,next) => {
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
    const token = jwt.sign({ userId: user._id ,role:user.role}, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

// Create admin (only for owner)
export const createAdmin = async (req, res,next) => {
  try {
    const { userId } = req.user;
    const { name, email, password, phoneNumber } = req.body;


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
    next(error);
  }
};

// Remove admin (Only owner can remove admin)
export const removeAdmin = async (req, res,next) => {
  try {
    const { userId } = req.user;
    const { adminId } = req.params;


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
    next(error);
  }
};

// Get all admins
export const getAdmins = async (req, res,next) => {
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
    next(error);
  }
};
