import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class RoutesRepository {
  static async search(start_place, destn_place, date) {
    const query = `
    SELECT 
        bus_id
    from route_schedule rs
    join routes r on r.route_id = rs.route_id and r.start_place = $1 and r.destn_place = $2 
    where rs.date = $3
    `;
    try {
      return await db.manyOrNone(query, [start_place, destn_place, date]);
    } catch (err) {
      throw new ErrorResponse(
        " DB failed in searching the bus_id " + err.message,
        466
      );
    }
  }
  static async findRoute(options) {
    let columns = Object.keys(options);
    let values = Object.values(options);
    let conditions = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(" AND ");

    const query = `Select * from routes where ${conditions}  `;

    try {
      return await db.oneOrNone(query, [...values]);
    } catch (err) {
      throw new ErrorResponse("DB failed in search route " + err.message, 466);
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
      throw new ErrorResponse("DB add route failed " + err.message, 466);
    }
  }

  static async getDetails(bus_id, date) {
    const query = ` 
    SELECT 
        rs.route_id ,
        r.start_place ,
        r.destn_place ,
        TO_CHAR(rs.date , 'DD-MM-YYYY') as assigned_date  , 
        b.bus_name 
    from routes r 
    join route_schedule rs on r.route_id = rs.route_id and rs.date = $1 and rs.bus_id = $2 
    join bus b on b.bus_id = rs.bus_id `;
    try {
      return await db.oneOrNone(query, [date, bus_id]);
    } catch (err) {
      throw new ErrorResponse(
        "DB failed in checking conflicts for route assignment " + err.message,
        466
      );
    }
  }
  static async assignRoute(routeData) {
    const query = `
    INSERT INTO route_schedule(bus_id , date , route_id)
    SELECT bus_id , date , route_id from json_populate_record(NULL::route_schedule , $1::json )
    returning * , TO_CHAR(date , 'DD-MM-YYYY') as date ;`;

    try {
      return await db.oneOrNone(query, [routeData]);
    } catch (err) {
      throw new ErrorResponse("DB failed in assign route " + err.message, 466);
    }
  }
}
