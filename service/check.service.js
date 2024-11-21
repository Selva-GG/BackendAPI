import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class CheckService {
  static isAdmin = async (req, res, next) => {
    try {
      let user = await UserRepository.findUser("users", {
        user_id: req.user_id,
      });
      if (!user) {
        return res
          .status(403)
          .json({ message: "No user Found with this id " + req.user_id });
      }
      if (user.role != "ADMIN") {
        return res.status(403).json({ message: "Only Admin access" });
      }
      next();
    } catch (err) {
      return next(err);
    }
  };
  static validBus = async (req, res, next) => {
    let { bus_id } = req.body;
    try {
      let busFound = await BusRepository.findBus({ bus_id });
      if (!busFound) {
        return res.status(209).json({
          message: `No bus is with the id -> ${bus_id}`,
        });
      }
      next();
    } catch (err) {
      return next(err);
    }
  };

  static validRoute_assigned = async (req, res, next) => {
    let { bus_id, start_place, destn_place, date } = req.body;
    try {
      const isAssigned = bus_id
        ? await RouteRepository.findRouteSchedule("rs", { bus_id }, date)
        : await RouteRepository.findRouteSchedule(
            "r",
            { start_place, destn_place },
            date
          );

      if (isAssigned.length == 0) {
        return res.status(209).json({
          message: " No buses assigned for this route on " + date,
        });
      }
      req.assignedBuses = isAssigned;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static validSeat = async (req, res, next) => {
    let { seat_id } = req.body;
    try {
      let seatExists = await BusRepository.seatExists({ seat_id });
      if (!seatExists) {
        return res
          .status(409)
          .json({ message: `No seat exists with this seat id ${seat_id}` });
      }
      next();
    } catch (err) {
      return next(err);
    }
  };
}
