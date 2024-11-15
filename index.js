import {errorHandler } from "./middleware/errorLogger.js";
import app from "./app.js";
import userRouter from "./routes/user.js";
import express from "express";

app.use(express.json());

app.use("/", userRouter);

app.use(errorHandler);
