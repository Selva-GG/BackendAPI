import ErrorResponse from "../model/error.model.js";
import BookingRepository from "../repository/booking.repository.js";
import BusRepository from "../repository/bus.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class BookingService {
  static async userBookings(user_id) {
    await UserRepository.findUser({ user_id });

    let bookings = await BookingRepository.getUserBookings(user_id);
    if (!bookings) {
      throw new ErrorResponse(" No booking found on user_id " + user_id, 409);
    }
    return bookings;
  }

  static async cancelBooking(schedule_id) {
    await BusRepository.findSeats({ schedule_id });
    return await BookingRepository.cancelBooking(schedule_id);
  }

  static async book(data) {
    let { user_id, seat_id, bus_id, date } = data;
    await UserRepository.findUser({ user_id });
    await BusRepository.findSeats({
      seat_id,
      bus_id,
      travel_date: date,
    });
    return await BookingRepository.Book(user_id, bus_id, seat_id, date);
  }

  static async showSeatDetails(data) {
    let { bus_id, date } = data;
    let seats = await BusRepository.seatDetails(bus_id, date);
    return seats;
  }

  static async search(data, buses) {
    let { date } = data;
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
  }
}
