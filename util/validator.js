import ErrorResponse from "../model/error.model.js";

export default class Validator {
  static async isAdmin(user_id) {
    try {
      let user = await UserRepository.findUser({ user_id });
      if (user.role !== "ADMIN") {
        throw new ErrorResponse("Only Admin access", 403);
      }
    } catch (err) {
      throw err;
    }
  }

  static async validBus(bus_id) {
    try {
      await BusRepository.findBus({ bus_id });
    } catch (err) {
      throw err;
    }
  }

  static async checkingBus(data) {
    let { bus_id, start_place, destn_place, date } = data;
    try {
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
    } catch (err) {
      throw err;
    }
  }

  static async validSeat(seat_id) {
    try {
      await BusRepository.seatExists({ seat_id });
    } catch (err) {
      throw err;
    }
  }
}
