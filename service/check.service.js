import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";

export default class CheckService {
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
}
