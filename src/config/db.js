import mongoose from "mongoose";
import { DATABASE_URI } from "./dotenv.js";
import { initializeFee } from "../models/fee.js";

//dab connection
export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI, {dbName:"e-badal"});
    console.log("database connected successfully");

  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
