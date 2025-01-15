import express from 'express';
import { createTransaction, getAllTransactions, getTransactionAnalytics, getUserTransactions, updateTransactionStatus } from '../controllers/transactions.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User routes

// Transaction routes
router.post('/create-transaction', auth, createTransaction);
router.patch('/:transactionId', auth, updateTransactionStatus);
router.get('/transactions', auth, getAllTransactions);
router.get('/analytics', auth, getTransactionAnalytics);
router.get('/transactions-history', auth, getUserTransactions);


export default router;
