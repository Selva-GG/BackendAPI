import { errorHandler } from "./middleware/errorLogger.js";
import app from "./app.js";
import userRouter from "./routes/users/user.js";
import busRouter from "./routes/bus/bus.js";
import bookingRouter from "./routes/booking/booking.js";
import docsRouter from "./routes/api-docs/api.js";
import express from "express";
import cors from "cors";

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/api-docs", docsRouter);
app.use("/bus", busRouter);
app.use("/bookings", bookingRouter);

app.use(errorHandler);
