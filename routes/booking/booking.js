import express from "express";
import BookingService from "../../service/booking.service.js";
import swaggerValidation from "openapi-validator-middleware";
import swagger from "./booking.swagger.json" assert { type: "json" };
import request_auth from "../../middleware/request_auth.js";
import CheckService from "../../service/check.service.js";

const router = express.Router();

const bookingValidation = swaggerValidation.getNewMiddleware(swagger);

router.get("/:id", BookingService.userBookings, (req, res) => {
  res.status(201).json({ message: "User Bookings", data: req.bookings });
});

router.post("/cancel", BookingService.cancelBooking, (req, res) => {
  res.status(201).json({ message: "Cancelled Seat", data: req.seat });
});

router.post(
  "/book",
  CheckService.validBus,
  CheckService.validRoute_assigned,
  BookingService.book,
  (req, res) => {
    res.status(201).json({ message: "Seat Booked", data: req.response });
  }
);
router.post(
  "/seats",
  CheckService.validBus,
  CheckService.validRoute_assigned,
  BookingService.showSeatDetails,
  (req, res) => {
    res.status(201).json({
      message: ` Seats for Bus id : ${req.body.bus_id}`,
      data: req.seats,
    });
  }
);

router.post(
  "/",
  CheckService.validRoute_assigned,
  BookingService.search,
  (req, res) => {
    res.status(201).json({
      message: " Buses in the specified route",
      data: req.buses,
    });
  }
);

export default router;
