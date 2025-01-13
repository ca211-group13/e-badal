import express from "express";
import { getFees, updateDepositFee, updateWithdrawalFee, addAccount, createAdmin,  getUserProfile, loginUser, registerUser, removeAdmin, deleteUser, updateUser, getAllUsers, getAdmins } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes

// Signup route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get all users (only for owner)
router.get('/all', auth, getAllUsers);

// Get user profile
router.get('/profile', auth, getUserProfile);

// Update user
router.patch('/update_user', auth, updateUser);

// Delete user
router.delete('/delete_user', auth, deleteUser);

// Add account
router.post('/add-account', auth, addAccount);


// Create admin (only for owner)
router.post('/create-admin', auth, createAdmin);

//  Remove admin
router.delete('/remove_admin/:adminId', auth, removeAdmin);


// Get all admins
router.get('/admins', auth, getAdmins);

// Fee routes
router.get("/fees", getFees);
router.put("/fees/deposit", auth, updateDepositFee);
router.put("/fees/withdrawal", auth, updateWithdrawalFee);

export default router;