import express from "express";
import BookingService from "../../service/booking.service.js";

const router = express.Router();

router.get("/:id", BookingService.userBookings, (req, res) => {
  res.status(201).json({ message: "User Bookings", data: req.bookings });
});

router.post("/cancel", BookingService.cancelBooking, (req, res) => {
  res.status(201).json({ message: "Cancelled Seat", data: req.seat });
});

export default router;
