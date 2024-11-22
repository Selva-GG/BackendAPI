import ErrorResponse from "../model/error.model.js";
import AdminRepository from "../repository/admin.repository.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class AdminService {
  static async createAdmin(data) {
    return await UserRepository.addAdmin(data, "ADMIN");
  }
  static async showAllBuses() {
    let buses = await AdminRepository.showBuses();
    if (!buses) {
      throw new ErrorResponse("No Buses Found", 409);
    }
    return buses;
  }
  static async addRoute(data) {
    let { start_place, destn_place } = data;
    await RouteRepository.findRoute(data, "Route already exists", true);
    return await AdminRepository.addRoute(start_place, destn_place);
  }

  static async assignRoute(data) {
    let { bus_id, date } = data;
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
  }

  static async insertBus(data) {
    let { bus_name, capacity, type } = data;
    await BusRepository.findBus({ bus_name });
    return await AdminRepository.insertBus(bus_name, capacity, type);
  }
}
