import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class BookingRepository {
  static async getUserBookings(user_id) {
    const query = `
    With combined_records as (
     Select user_id , seat_id , bus_id , TO_CHAR(travel_date, 'YYYY-MM-DD') as travel_date , status ,  TO_CHAR(created_at, 'YY-MM-DD HH24:MI') AS created_at
     from seat_schedule
     where user_id = $1
     UNION
     Select user_id , seat_id , bus_id , TO_CHAR(travel_date, 'YYYY-MM-DD') as travel_date , 'Cancelled'  as status , TO_CHAR(created_at, 'YY-MM-DD HH24:MI') AS created_at
     from seat_cancelled
     where user_id = $1
    )
    select * from combined_records
    order by combined_records.created_at
    `;
    try {
      return await db.manyOrNone(query, [user_id]);
    } catch (err) {
      throw new ErrorResponse(
        `Db error on user's booking fetch ${err.message}`,
        466
      );
    }
  }

  static async cancelBooking(schedule_id) {
    const query = ` 
    BEGIN;

WITH select_record AS (
    SELECT *
    FROM seat_schedule
    WHERE schedule_id = $1
)
INSERT INTO seat_cancelled (schedule_id, seat_id, bus_id, travel_date, user_id)
SELECT schedule_id, seat_id, bus_id, travel_date, user_id
FROM select_record
RETURNING schedule_id;

COMMIT;

DELETE FROM seat_schedule
WHERE schedule_id = $1
RETURNING *;  

    `;
    try {
      return await db.oneOrNone(query, [schedule_id]);
    } catch (err) {
      throw new ErrorResponse(`Db cancel seat failed ${err.message} `, 466);
    }
  }

  static async Book(user_id, bus_id, seat_id, date) {
    let query = `
    INSERT INTO seat_schedule (bus_id, seat_id, travel_date, status , user_id) 
    VALUES ($1, $2, $3, 'Booked',$4) 
    RETURNING *;
`;
    try {
      return await db.oneOrNone(query, [bus_id, seat_id, date, user_id]);
    } catch (err) {
      throw new ErrorResponse(` Db Booking seat failed ${err.message}`, 466);
    }
  }
  
}
