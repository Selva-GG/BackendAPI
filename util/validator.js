import ErrorResponse from "../model/error.model.js";
import BusRepository from "../repository/bus.repository.js";
import RouteRepository from "../repository/route.repository.js";
import UserRepository from "../repository/user.repository.js";

export default class Validator {
  static async isAdmin(user_id) {
    let user = await UserRepository.findUser({ user_id });
    if (user.role !== "ADMIN") {
      throw new ErrorResponse("Only Admin access", 403);
    }
  }

  static async validBus(bus_id) {
    await BusRepository.findBus({ bus_id });
  }

  static async checkingBus(data) {
    let { bus_id, start_place, destn_place, date } = data;
    const isAssigned = bus_id
      ? await RouteRepository.findRouteSchedule("rs", { bus_id }, date)
      : await RouteRepository.findRouteSchedule(
          "r",
          { start_place, destn_place },
          date
        );

    if (isAssigned.length == 0) {
      throw new ErrorResponse(
        `No buses assigned for this route on ${date}`,
        409
      );
    }
    return isAssigned;
  }

  static async validSeat(seat_id) {
    await BusRepository.seatExists({ seat_id });
  }
}
