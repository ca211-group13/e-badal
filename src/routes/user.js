import express from "express";
import { registerUser, getUsers,loginUser, getUserProfile, updateUser, deleteUser, createAdmin, removeAdmin, getAdmins} from "../controllers/user.js";
import {auth} from "../middlewares/authMiddleware.js"
import { addAccount } from "../controllers/accounts.js";

const router=express.Router();


router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.get("/",getUsers)
router.get('/profile', auth, getUserProfile);
router.patch('/update_user', auth, updateUser);
// Delete user
router.delete('/delete_user', auth, deleteUser);
router.post('/add-account', auth, addAccount);


// Create admin (only for owner)
router.post('/create-admin', auth, createAdmin);

//  Remove admin
router.delete('/remove_admin/:adminId', auth, removeAdmin);
// Get all admins
router.get('/admins', auth, getAdmins);


export default router;