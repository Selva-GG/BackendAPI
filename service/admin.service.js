import ErrorResponse from "../model/error.model.js";
import AdminRepository from "../repository/admin.repository.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";

export default class RoutesService {
  static showAllBuses = async (req, res, next) => {
    try {
      let buses = await AdminRepository.showBuses();
      if (!buses) {
        req.status(203).json({ message: "No Buses Found" });
      }
      req.buses = buses;
      next();
    } catch (err) {
      return next(err);
    }
  };
  static addRoute = async (req, res, next) => {
    let { start_place, destn_place } = req.body;
    try {
      let routeExists = await RouteRepository.findRoute(req.body);
      if (routeExists) {
        return res
          .status(202)
          .json({ message: "Route already exists", data: routeExists });
      }
      let new_route = await AdminRepository.addRoute(start_place, destn_place);
      req.new_route = new_route;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static assignRoute = async (req, res, next) => {
    let { bus_id, date } = req.body;

    try {
      let routeConflicts = await RouteRepository.getDetails(bus_id, date);
      if (routeConflicts) {
        return res.status(203).json({
          message: "Bus is already assigned ",
          data: routeConflicts,
        });
      }
      let routeAssigned = await AdminRepository.assignRoute(req.body);
      req.assignedRoute = routeAssigned;
      next();
    } catch (err) {
      return next(err);
    }
  };

  static insertBus = async (req, res, next) => {
    let { bus_name, capacity, type } = req.body;
    try {
      if (await BusRepository.findBus({ bus_name })) {
        throw new ErrorResponse("Bus name not available", 403);
      }
      req.bus = await AdminRepository.insertBus(bus_name, capacity, type);
      next();
    } catch (err) {
      return next(err);
    }
  };
}
