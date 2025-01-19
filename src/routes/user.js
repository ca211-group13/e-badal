import express from "express";
import {
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { auth } from "../middlewares/authMiddleware.js";
import { addAccount } from "../controllers/accounts.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users (requires authentication)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/all", auth, getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     accounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           phoneNumber:
 *                             type: string
 *                           usdtAddress:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", auth, getUserProfile);

/**
 * @swagger
 * /api/users/update_user:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input or email already in use
 *       401:
 *         description: Unauthorized
 */
router.patch("/update_user", auth, updateUser);

/**
 * @swagger
 * /api/users/delete_user:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete_user", auth, deleteUser);

/**
 * @swagger
 * /api/users/add-account:
 *   post:
 *     summary: Add a new account to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [EVC, Sahal, Zaad, USDT(TRC-20), USDT(BEP-20)]
 *               phoneNumber:
 *                 type: string
 *               usdtAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/add-account", auth, addAccount);

export default router;