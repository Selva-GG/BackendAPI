import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class AdminRepository {
  static async assignRoute(routeData) {
    const query = `
    INSERT INTO route_schedule(bus_id , date , route_id)
    SELECT bus_id , date , route_id from json_populate_record(NULL::route_schedule , $1::json )
    returning * , TO_CHAR(date , 'DD-MM-YYYY') as date ;`;

    try {
      return await db.oneOrNone(query, [routeData]);
    } catch (err) {
      throw new ErrorResponse("DB failed in assign route " + err.message, 409);
    }
  }
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
               WHEN gs.num <= inserted_bus.capacity / 2 
              THEN CONCAT('L', gs.num)
              ELSE CONCAT('R', gs.num - inserted_bus.capacity / 2)
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
      throw new ErrorResponse("DB Insertion of bus failed " + err.message, 500);
    }
  }
  static async addRoute(start_place, destn_place) {
    const query = `
        INSERT into routes(start_place , destn_place)
        values ($1 , $2)
        returning *;`;

    try {
      return await db.oneOrNone(query, [start_place, destn_place]);
    } catch (err) {
      throw new ErrorResponse("DB add route failed " + err.message, 409);
    }
  }
  static async showBuses() {
    const query = `
    SELECT * from bus ;`;
    try {
      return await db.manyOrNone(query);
    } catch (err) {
      throw new ErrorResponse("DB Fetch Bus Failed" + err.message, 409);
    }
  }
}
