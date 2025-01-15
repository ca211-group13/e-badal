import express from "express";
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";

const app = express();
app.use(express.json());
app.use(cors());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

import userRouter from "./routes/user.js";
import feeRouter from "./routes/feeRout.js";
import transactionRout from "./routes/transactionRout.js";

app.use("/api/users", userRouter);
app.use("/api/fees", feeRouter);
app.use("/api/transactions", transactionRout);

export default app;
