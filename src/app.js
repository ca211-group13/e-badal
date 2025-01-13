import express from "express";
const app = express();
app.use(express.json());

import userRouter from "./routes/user.js";

app.use("/api/user",userRouter)

export default app;
