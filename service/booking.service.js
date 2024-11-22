import BookingRepository from "../repository/booking.repository.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class BookingService {
  static userBookings = async (req, res, next) => {
    let user_id = req.params.id;
    try {
       await UserRepository.findUser({ user_id });
  
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
      await BusRepository.findSeats({ schedule_id });
      req.seat = await BookingRepository.cancelBooking(schedule_id);
      next();
    } catch (err) {
      return next(err);
    }
  };

  static book = async (req, res, next) => {
    let { user_id, seat_id, bus_id, date } = req.body;
    try {
      await UserRepository.findUser({ user_id });
      await BusRepository.findSeats({
        seat_id,
        bus_id,
        travel_date: date,
      });
      req.response = await BookingRepository.Book(
        user_id,
        bus_id,
        seat_id,
        date
      );
      next();
    } catch (err) {
      return next(err);
    }
  };

  static showSeatDetails = async (req, res, next) => {
    let { bus_id, date } = req.body;
    try {
      let seats = await BusRepository.seatDetails(bus_id, date);
      req.seats = seats;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static search = async (req, res, next) => {
    let { date } = req.body;
    let buses = req.assignedBuses;
    try {
      let buses_details = await Promise.all(
        buses.map(async (bus) => {
          const bus_detail = await BusRepository.findBus({
            bus_id: bus.bus_id,
          });
          bus_detail.seatDetails = await BusRepository.basicDetail(
            bus.bus_id,
            date
          );
          return bus_detail;
        })
      );
      req.buses = buses_details;
      next();
    } catch (err) {
      return next(err);
    }
  };
}
