import { JWT_SECRET_KEY } from "../config/dotenv.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";


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
      const token = jwt.sign({ userId: user._id }, jwtSwcret, { expiresIn: '7d' });
      
      res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getUsers=async(req,res)=>{

    const users=await User.find();
    res.status(200).json(users);

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
      const token = jwt.sign({ userId: user._id }, jwtSwcret, { expiresIn: '7d' });

      res.json({ success: true, message: "Login successful", token });
  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};