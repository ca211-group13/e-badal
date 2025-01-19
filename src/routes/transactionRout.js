import express from 'express';
import { createTransaction, getAllTransactions, getTransactionAnalytics, getUserTransactions, updateTransactionStatus } from '../controllers/transactions.js';
import { auth } from "../middlewares/guard.js";
import { allowRoles } from '../middlewares/acl.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions/create-transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - localPhoneNumber
 *               - usdtAddress
 *               - chainType
 *               - amount
 *               - type
 *             properties:
 *               localPhoneNumber:
 *                 type: string
 *                 example: "252634567890"
 *               usdtAddress:
 *                 type: string
 *                 example: "TRx4h7dgf..."
 *               chainType:
 *                 type: string
 *                 enum: [BEP-20, TRC-20]
 *               amount:
 *                 type: number
 *                 example: 100
 *               type:
 *                 type: string
 *                 example: "deposit"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     amount:
 *                       type: number
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/create-transaction', auth, createTransaction);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   patch:
 *     summary: Update transaction status (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Failed, Success]
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.patch('/:transactionId', auth,allowRoles("admin","owner"), updateTransactionStatus);

/**
 * @swagger
 * /api/transactions/transactions:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Failed, Success]
 *         description: Filter by transaction status
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/transactions', auth,allowRoles("admin","owner"), getAllTransactions);

/**
 * @swagger
 * /api/transactions/analytics:
 *   get:
 *     summary: Get transaction analytics (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTransactions:
 *                   type: number
 *                 successfulTransactions:
 *                   type: number
 *                 pendingTransactions:
 *                   type: number
 *                 failedTransactions:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', auth,allowRoles("admin","owner"), getTransactionAnalytics);

/**
 * @swagger
 * /api/transactions/transactions-history:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                       type:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/transactions-history', auth, getUserTransactions);

export default router;
