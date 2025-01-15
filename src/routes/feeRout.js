import express from "express"
import { getFees, updateDepositFee, updateWithdrawalFee } from "../controllers/fees.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Fee:
 *       type: object
 *       properties:
 *         depositFee:
 *           type: number
 *           default: 2
 *           description: Fee percentage for deposits
 *         withdrawalFee:
 *           type: number
 *           default: 2
 *           description: Fee percentage for withdrawals
 */

/**
 * @swagger
 * /api/fees:
 *   get:
 *     summary: Get current fee settings
 *     tags: [Fees]
 *     responses:
 *       200:
 *         description: Current fee settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fee'
 *       404:
 *         description: Fees not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fees not found
 */
router.get('/', getFees);

/**
 * @swagger
 * /api/fees/deposit:
 *   put:
 *     summary: Update deposit fee
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - depositFee
 *             properties:
 *               depositFee:
 *                 type: number
 *                 example: 2.5
 *     responses:
 *       200:
 *         description: Deposit fee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fee'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deposit fee is required
 */
router.put("/deposit", auth, updateDepositFee);

/**
 * @swagger
 * /api/fees/withdrawal:
 *   put:
 *     summary: Update withdrawal fee
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - withdrawalFee
 *             properties:
 *               withdrawalFee:
 *                 type: number
 *                 example: 2.5
 *     responses:
 *       200:
 *         description: Withdrawal fee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fee'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Withdrawal fee is required
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
router.put("/withdrawal", auth, updateWithdrawalFee);

export default router;