import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URI= process.env.DATABASE_URL ;
export const PORT=process.env.PORT || 5000;
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
