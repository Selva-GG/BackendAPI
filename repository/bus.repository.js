import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class BusRepository {
  static async insertBus(bus_name, capacity, type) {
    let query = `
WITH inserted_bus AS (
    INSERT INTO bus (bus_name, capacity, type, status)
    VALUES ($1, $2, $3, 'Active') 
    RETURNING bus_id, bus_name, capacity
),
generated_seats AS (
    INSERT INTO seats (bus_id, seat_name)
    SELECT bus_id, 
           CASE 
               WHEN gs.num <= inserted_bus.capacity / 2 THEN 'L' || gs.num  -- Left side seats
               ELSE 'R' || (gs.num - inserted_bus.capacity / 2)  -- Right side seats
           END AS seat_name
    FROM inserted_bus, generate_series(1, inserted_bus.capacity) AS gs(num)
    RETURNING seat_id, bus_id, seat_name
)
SELECT bus_id, bus_name, capacity
        FROM inserted_bus
        ;`;
    try {
      return await db.oneOrNone(query, [bus_name, capacity, type]);
    } catch (err) {
      throw new ErrorResponse("Insertion of bus error " + err.message, 500);
    }
  }

  static async findBus(columnName, value) {
    const query = `SELECT * FROM bus WHERE ${columnName} = $1 LIMIT 1`;
    try {
      return await db.oneOrNone(query, [value]);
    } catch (err) {
      throw new ErrorResponse(`Database query failed: ${err.message}`, 466);
    }
  }
  static async findSeats(columnName, value) {
    let columns, values;
    if (Array.isArray(columnName) && Array.isArray(value)) {
      const conditions = columnName.map(
        (col, index) => `${col} = $${index + 1}`
      );
      columns = conditions.join(" AND ");
      values = value;
    } else {
      columns = `${columnName} = $1`;
      values = [value];
    }
    const query = `SELECT * FROM seat_schedule WHERE ${columns}  LIMIT 1`;
    try {
      return await db.oneOrNone(query, values);
    } catch (err) {
      throw new ErrorResponse(
        `Database search seat failed: ${err.message}`,
        466
      );
    }
  }

  static async showBuses() {
    const query = `
    SELECT * from bus ;`;
    try {
      return await db.manyOrNone(query);
    } catch (err) {
      throw new ErrorResponse("DB Fetch Bus Failed" + err.message, 466);
    }
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
      return db.oneOrNone(query, [bus_id, date]);
    } catch (err) {
      throw new ErrorResponse(
        "DB basic Seat details fetch error " + err.message,
        500
      );
    }
  }
}
