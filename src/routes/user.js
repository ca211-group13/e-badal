import express from "express";
import { registerUser, getUsers,loginUser, getUserProfile} from "../controllers/user.js";
import {auth} from "../middlewares/authMiddleware.js"
import { addAccount } from "../controllers/accounts.js";

const router=express.Router();


router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.get("/",auth,getUsers)
router.get('/profile', auth, getUserProfile);

router.post('/add-account', auth, addAccount);

export default router;