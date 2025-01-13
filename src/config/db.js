import mongoose from "mongoose";
import { DATABASE_URI } from "./dotenv.js";

//dab connection
export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI, {});
    console.log("database connected successfully");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
