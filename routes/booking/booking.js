import express from "express";
import BookingService from "../../service/booking.service.js";
import swaggerValidation from "openapi-validator-middleware";
import swagger from "./booking.swagger.json" assert { type: "json" };
import request_auth from "../../middleware/request_auth.js";

const router = express.Router();

const bookingValidation = swaggerValidation.getNewMiddleware(swagger);
router.use(bookingValidation.validate, request_auth);

router.get("/:id", BookingService.userBookings, (req, res) => {
  res.status(201).json({ message: "User Bookings", data: req.bookings });
});

router.post("/cancel", BookingService.cancelBooking, (req, res) => {
  res.status(201).json({ message: "Cancelled Seat", data: req.seat });
});

router.post("/book", BookingService.book, (req, res) => {
  res.status(201).json({ message: "Seat Booked", data: req.response });
});

export default router;
