// auth.js
import jwt from 'jsonwebtoken';
import { jwtSwcret } from '../../config/initialConfig.js';

export const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSwcret);
    req.user = { userId: decoded.userId }; // Set userId in req.user object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};