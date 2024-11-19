import BusRepository from "../repository/bus.repository.js";
import RoutesRepository from "../repository/routes.repository.js";

export default class RoutesService {
  static addRoute = async (req, res, next) => {
    let { start_place, destn_place } = req.body;
    try {
      let routeExists = await RoutesRepository.findRoute(req.body);
      if (routeExists) {
        return res
          .status(202)
          .json({ message: "Route already exists", data: routeExists });
      }
      let new_route = await RoutesRepository.addRoute(start_place, destn_place);
      req.new_route = new_route;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static assignRoute = async (req, res, next) => {
    let { bus_id, date } = req.body;

    try {
      let routeConflicts = await RoutesRepository.getDetails(bus_id, date);
      if (routeConflicts) {
        return res.status(203).json({
          message: "Bus is already assigned on same date ",
          data: routeConflicts,
        });
      }
      let routeAssigned = await RoutesRepository.assignRoute(req.body);
      req.assignedRoute = routeAssigned;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static search = async (req, res, next) => {
    let { start_place, destn_place, date } = req.body;
    try {
      let buses = await RoutesRepository.search(start_place, destn_place, date);

      let buses_details = await Promise.all(
        buses.map(async (bus) => {
          const bus_detail = await BusRepository.findBus("bus_id", bus.bus_id);
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
