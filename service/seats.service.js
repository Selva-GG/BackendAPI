import SeatsRepository from "../repository/seats.repository.js";

export default class SeatsService {

  static book = async (req, res, next) => {
    let { user_id, seat_id, bus_id, date } = req.body;
    const travelDate = date || new Date().toISOString().split("T")[0];
    try {
      let seatExists = await SeatsRepository.findSeat(
        ["seat_id", "bus_id", "travel_date"],
        [seat_id, bus_id, travelDate]
      );
      if (seatExists) {
        return res
          .status(405)
          .json({ message: "Seat is already booked for specific date" });
      }
      req.response = await SeatsRepository.Book(
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

  static show = async (req, res, next) => {
    let { bus_id, date } = req.body;
    const travelDate = date || new Date().toISOString().split("T")[0];

    try {
      let seats = await SeatsRepository.seatDetails(bus_id, travelDate);
      if (!seats) {
        return res
          .status(405)
          .json({ message: "Error occurred while fetching the seat" });
      }
      req.seats = seats;
      next();
    } catch (err) {
      return next(err);
    }
  };

}
