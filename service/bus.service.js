import ErrorResponse from "../model/error.model.js";
import BusRepository from "../repository/bus.repository.js";
import SeatsRepository from "../repository/seats.repository.js";

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
    let bus_name = req.params.id;
    try {
      let bus = await BusRepository.findBus("bus_name", bus_name);
      if (!bus) {
        throw new ErrorResponse("Bus is not available", 403);
      }
      let seats = await SeatsRepository.seatDetails(bus.bus_id);
      req.bus = { bus, seats };
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
      console.log(buses);
      req.buses = buses;
      next();
    } catch (err) {
      return next(err);
    }
  };
}
