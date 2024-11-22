import ErrorResponse from "../model/error.model.js";
import BookingRepository from "../repository/booking.repository.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class BookingService {
  static async userBookings(user_id) {
    try {
      await UserRepository.findUser({ user_id });

      let bookings = await BookingRepository.getUserBookings(user_id);
      if (!bookings) {
        throw new ErrorResponse(" No booking found on user_id " + user_id, 409);
      }
      return bookings;
    } catch (err) {
      throw err;
    }
  }

  static async cancelBooking(schedule_id) {
    try {
      await BusRepository.findSeats({ schedule_id });
      return await BookingRepository.cancelBooking(schedule_id);
    } catch (err) {
      throw err;
    }
  }

  static async book(data) {
    let { user_id, seat_id, bus_id, date } = data;
    try {
      await UserRepository.findUser({ user_id });
      await BusRepository.findSeats({
        seat_id,
        bus_id,
        travel_date: date,
      });
      return await BookingRepository.Book(user_id, bus_id, seat_id, date);
    } catch (err) {
      throw err;
    }
  }

  static async showSeatDetails(data) {
    let { bus_id, date } = data;
    try {
      let seats = await BusRepository.seatDetails(bus_id, date);
      return seats;
    } catch (err) {
      throw err;
    }
  }

  static async search(data, buses) {
    let { date } = data;
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
      return buses_details;
    } catch (err) {
      throw err;
    }
  }
}
