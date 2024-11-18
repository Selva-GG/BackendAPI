import { errorHandler } from "./middleware/errorLogger.js";
import app from "./app.js";
import userRouter from "./routes/users/user.js";
import busRouter from "./routes/bus/bus.js";
import seatRouter from "./routes/seats/seats.js";
import express from "express";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/bus", busRouter);
app.use("/seat", seatRouter);

app.use(errorHandler);
