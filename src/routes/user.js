import express from "express";
import { registerUser, getUsers,logingUser} from "../controllers/user.js";
const router=express.Router();

router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.get("/",getUsers)

export default router;