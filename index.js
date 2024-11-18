import { errorHandler } from "./middleware/errorLogger.js";
import app from "./app.js";
import userRouter from "./routes/users/user.js";
import busRouter from "./routes/bus/bus.js";
import seatRouter from "./routes/seats/seats.js";
import bookingRouter from "./routes/booking/booking.js";
import express from "express";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/bus", busRouter);
app.use("/seats", seatRouter);
app.use("/bookings", bookingRouter);

app.use(errorHandler);
