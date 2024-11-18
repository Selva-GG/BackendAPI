import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class SeatsRepository {
  static async Book(bus_id, seat_id) {
    let query = `
    INSERT INTO seat_schedule (bus_id, seat_id, travel_date, status) 
    VALUES ($1, $2, CURRENT_DATE, 'Booked') 
    RETURNING *;
`;
    try {
      return await db.oneOrNone(query, [bus_id, seat_id]);
    } catch (err) {
      throw new ErrorResponse(` Db Booking seat failed ${err.message}`, 466);
    }
  }

  static async seatDetails(bus_id) {
    const query = `
    Select s.seat_name , s.bus_id , COALESCE(sl.status , 'Available') as seat_status
    from seats s
    left join seat_schedule sl on s.seat_id = sl.seat_id
    where s.bus_id = $1
    order by s.seat_id
    ;`;
    try {
      return await db.manyOrNone(query, [bus_id]);
    } catch (err) {
      throw new ErrorResponse("DB Search bus error " + err.message, 500);
    }
  }
}
