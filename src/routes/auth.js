import express from "express";
import {
  registerUser,
  loginUser,
  createAdmin,
  removeAdmin,
  getAdmins,
} from "../controllers/auth.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and admin management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/create-admin:
 *   post:
 *     summary: Create a new admin (Owner only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 */
router.post("/create-admin", auth, createAdmin);

/**
 * @swagger
 * /api/auth/remove-admin/{adminId}:
 *   delete:
 *     summary: Remove an admin (Owner only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/remove-admin/:adminId", auth, removeAdmin);

/**
 * @swagger
 * /api/auth/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get("/admins", auth, getAdmins);

export default router;
