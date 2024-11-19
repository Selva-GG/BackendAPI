import ErrorResponse from "../model/error.model.js";
import BusRepository from "../repository/bus.repository.js";

export default class BusService {
  static insertBus = async (req, res, next) => {
    let { bus_name, capacity, type } = req.body;
    try {
      if (await BusRepository.findBus("bus_name", bus_name)) {
        throw new ErrorResponse("Bus name not available", 403);
      }
      req.bus = await BusRepository.insertBus(bus_name, capacity, type);
      next();
    } catch (err) {
      return next(err);
    }
  };

  static searchBus = async (req, res, next) => {
    let { bus_id, date } = req.body;
    const travelDate = date || new Date().toISOString().split("T")[0];
    try {
      let bus = await BusRepository.findBus("bus_id", bus_id);
      if (!bus) {
        throw new ErrorResponse("Bus is not available", 403);
      }
      let seats = await BusRepository.basicDetail(bus_id, travelDate);
      req.bus = {
        bus,
        seatDetails: {
          "Total seats": seats.total_seats,
          "Booked Seats": seats.booked_seats,
          "Pending Seats": seats.pending_seats,
          "Available Seats": seats.available_seats,
        },
      };
      next();
    } catch (err) {
      return next(err);
    }
  };

  static showAllBuses = async (req, res, next) => {
    try {
      let buses = await BusRepository.showBuses();
      if (!buses) {
        req.status(203).json({ message: "No Buses Found" });
      }
      req.buses = buses;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static showSeatDetails = async (req, res, next) => {
    let { bus_id, date } = req.body;
    const travelDate = date || new Date().toISOString().split("T")[0];

    try {
      let seats = await BusRepository.seatDetails(bus_id, travelDate);
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
