import express from "express";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());
import userRouter from "./routes/user.js";
import feeRouter from "./routes/feeRout.js";

app.use("/api/users",userRouter)
app.use("/api/fees",feeRouter)
export default app;
