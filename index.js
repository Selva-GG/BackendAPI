import { logger } from "./middleware/logger.js";
import { errorLogger, errorHandler } from "./middleware/errorLogger.js";
import app from "./app.js";
import authRouter from "./routes/auth.js";
import express from "express";

app.use(express.json());
app.use(logger);

app.use("/", authRouter);

app.use(errorLogger, errorHandler);
