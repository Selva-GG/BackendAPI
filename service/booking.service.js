import BookingRepository from "../repository/booking.repository.js";
import BusRepository from "../repository/bus.repository.js";

export default class BookingService {
  static userBookings = async (req, res, next) => {
    let user_id = req.params.id;
    try {
      let bookings = await BookingRepository.getUserBookings(user_id);
      if (!bookings) {
        res
          .status(205)
          .json({ message: " No booking found on user_id " + user_id });
      }
      req.bookings = bookings;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static cancelBooking = async (req, res, next) => {
    let { schedule_id } = req.body;
    try {
      let seatExists = await BusRepository.findSeats(
        "schedule_id",
        schedule_id
      );
      if (!seatExists) {
        return res.status(403).json({
          message: `No such seat exists with schedule_id : ${schedule_id}`,
        });
      }
      req.seat = await BookingRepository.cancelBooking(schedule_id);
      next();
    } catch (err) {
      return next(err);
    }
  };

  static book = async (req, res, next) => {
    let { user_id, seat_id, bus_id, date } = req.body;
    const travelDate = date || new Date().toISOString().split("T")[0];
    try {
      let seatExists = await BusRepository.findSeats(
        ["seat_id", "bus_id", "travel_date"],
        [seat_id, bus_id, travelDate]
      );
      if (seatExists) {
        return res
          .status(405)
          .json({ message: "Seat is already booked for specific date" });
      }
      req.response = await BookingRepository.Book(
        user_id,
        bus_id,
        seat_id,
        travelDate
      );
      next();
    } catch (err) {
      return next(err);
    }
  };
}
