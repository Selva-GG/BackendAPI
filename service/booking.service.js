import { use } from "bcrypt/promises.js";
import BookingRepository from "../repository/booking.repository.js";
import SeatsRepository from "../repository/seats.repository.js";

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
      let seatExists = await SeatsRepository.findSeat(
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
  
}
