import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";
import BaseRepository from "./base.repository.js";

export default class BusRepository extends BaseRepository {
  static async findBus(options) {
    return await this.find("bus", options);
  }
  static async findSeats(options) {
    return await this.find("seat_schedule", options);
  }

  static async seatDetails(bus_id, date) {
    const query = `
    Select s.seat_name , s.bus_id , COALESCE(sl.status , 'Available')  as seat_status ,  $2 as travel_date
    from seats s
    left join seat_schedule sl on s.seat_id = sl.seat_id and s.bus_id = sl.bus_id and sl.travel_date = $2
    where s.bus_id = $1
    order by s.seat_id
    ;`;
    try {
      return await db.manyOrNone(query, [bus_id, date]);
    } catch (err) {
      throw new ErrorResponse("DB Search bus error " + err.message, 500);
    }
  }

  static async basicDetail(bus_id, date) {
    const query = ` SELECT 
    COUNT (*) as total_seats,
    COUNT(CASE WHEN COALESCE(sl.status, 'Available') = 'Available' THEN 1 END) AS available_seats,
    COUNT(CASE WHEN sl.status = 'Pending' THEN 1 END) AS pending_seats,
    COUNT(CASE WHEN sl.status = 'Booked' THEN 1 END) AS booked_seats
FROM 
    seats s
LEFT JOIN 
    seat_schedule sl 
ON 
    s.seat_id = sl.seat_id 
    AND s.bus_id = sl.bus_id 
    AND sl.travel_date = $2
WHERE 
    s.bus_id = $1;`;

    try {
      return await db.oneOrNone(query, [bus_id, date]);
    } catch (err) {
      throw new ErrorResponse(
        "DB basic Seat details fetch error " + err.message,
        500
      );
    }
  }
}
