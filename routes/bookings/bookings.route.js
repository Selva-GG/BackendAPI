import express from "express";
import bookingService from "../../service/booking.service.js";
import tryCatchWrapper from "../../util/tryCatchWrapper.js";
import validator from "../../util/validator.js";

class BookingController {
  constructor() {
    this.router = express.Router();
    this.router.get("/:id", tryCatchWrapper(this.#user_bookings));
    this.router.post("/cancel", tryCatchWrapper(this.#cancel_booking));
    this.router.post("/book", tryCatchWrapper(this.#book));
    this.router.post("/seats", tryCatchWrapper(this.#seats));
    this.router.post("/", tryCatchWrapper(this.#buses));
  }
  #user_bookings = async (req, res) => {
    let bookings = await bookingService.userBookings(req.params.id);
    res.status(201).json({ message: "User Bookings", bookings });
  };
  #cancel_booking = async (req, res) => {
    let seat = await bookingService.cancelBooking(req.body.schedule_id);
    res.status(201).json({ message: "Cancelled Seat", seat });
  };

  #book = async (req, res, next) => {
    await validator.validBus(req.body.bus_id);
    await validator.checkingBus(req.body);
    await validator.validSeat(req.body.seat_id);
    let response = await bookingService.book(req.body);
    res.status(201).json({ message: "Seat Booked", response });
  };
  #seats = async (req, res, next) => {
    await validator.validBus(req.body.bus_id);
    await validator.checkingBus(req.body);

    let seats = await bookingService.showSeatDetails(req.body);
    res.status(201).json({
      message: ` Seats for Bus id : ${req.body.bus_id}`,
      seats,
    });
  };
  #buses = async (req, res, next) => {
    let assignedBuses = await validator.checkingBus(req.body);
    let buses = await bookingService.search(req.body, assignedBuses);
    res.status(201).json({
      message: " Buses in the specified route",
      buses,
    });
  };
}
export default new BookingController().router;
