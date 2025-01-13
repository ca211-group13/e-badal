// auth.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/dotenv.js';

export const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log("decode user id")
    console.log(decoded)
    req.user = { userId: decoded.userId }; // Set userId in req.user object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};