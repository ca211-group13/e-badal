import express from "express"
import { getFees, updateDepositFee, updateWithdrawalFee } from "../controllers/fees.js";
import { auth } from "../middlewares/authMiddleware.js";


const router=express.Router();

router.get('/',getFees)
router.put("/deposit", auth, updateDepositFee);
router.put("/withdrawal", auth, updateWithdrawalFee);


export default router;