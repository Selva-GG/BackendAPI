import ErrorResponse from "../model/error.model.js";
import db from "../db/db.js";
import BaseRepository from "./base.repository.js";

export default class RouteRepository extends BaseRepository {
  static async findRouteSchedule(tableName, options, date) {
    let columns = Object.keys(options);
    let values = Object.values(options);
    let conditions = columns
      .map((col, index) => `${tableName}.${col} = $${index + 1}`)
      .join(" AND ");
    const query = `
    SELECT 
        bus_id
    from route_schedule rs
    join routes r on r.route_id = rs.route_id and ${conditions}
    where rs.date = $${columns.length + 1}
    `;
    try {
      return await db.manyOrNone(query, [...values, date]);
    } catch (err) {
      throw new ErrorResponse(
        "DB failed in searching the bus_id " + err.message,
        409
      );
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
        409
      );
    }
  }
  static async findRoute(options, err, onExisting) {
    return await this.unique("routes", options, err, onExisting);
  }
}
