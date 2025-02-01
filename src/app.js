import express from "express";
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
// comment//
const app = express();
app.use(express.json());
app.use(cors());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

import userRouter from "./routes/user.js";
import feeRouter from "./routes/feeRout.js";
import transactionRout from "./routes/transactionRout.js";
import authRouter from "./routes/auth.js";
import { globalErrorMiddleware } from "./middlewares/error.js";
//home rout

// auth rout
app.use("/api/auth", authRouter);
// uer rout
app.use("/api/users", userRouter);
//fees rout
app.use("/api/fees", feeRouter);
//transaction rout
app.use("/api/transactions", transactionRout);
//404 rout

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"rout not found"
    })
})

app.use(globalErrorMiddleware)

export default app;
