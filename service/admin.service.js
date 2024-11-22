import ErrorResponse from "../model/error.model.js";
import AdminRepository from "../repository/admin.repository.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class AdminService {
  static async createAdmin(data) {
    try {
      return await UserRepository.addAdmin(data, "ADMIN");
    } catch (err) {
      throw err;
    }
  }
  static async showAllBuses() {
    try {
      let buses = await AdminRepository.showBuses();
      if (!buses) {
        throw new ErrorResponse("No Buses Found", 409);
      }
      return buses;
    } catch (err) {
      throw err;
    }
  }
  static async addRoute(data) {
    let { start_place, destn_place } = data;
    try {
      await RouteRepository.findRoute(data, "Route already exists", true);
      return await AdminRepository.addRoute(start_place, destn_place);
    } catch (err) {
      throw err;
    }
  }

  static async assignRoute(data) {
    let { bus_id, date } = data;
    try {
      let routeConflicts = await RouteRepository.getDetails(bus_id, date);
      if (routeConflicts) {
        throw new ErrorResponse(
          {
            message: "Bus is already assigned ",
            data: routeConflicts,
          },
          409
        );
      }
      return await AdminRepository.assignRoute(req.body);
    } catch (err) {
      throw err;
    }
  }

  static async insertBus(data) {
    let { bus_name, capacity, type } = data;
    try {
      await BusRepository.findBus({ bus_name });
      return await AdminRepository.insertBus(bus_name, capacity, type);
    } catch (err) {
      throw err;
    }
  }
}
