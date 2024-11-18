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

  static async showBuses() {
    const query = `
    SELECT * from bus ;`
    try {
      return await db.manyOrNone(query)
    } catch (err) {
      throw new ErrorResponse('DB Fetch Bus Failed' + err.message , 466)
    }
  }
}
