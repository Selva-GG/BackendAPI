import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class BaseRepository {
  static async unique(tableName, options) {
    let columns = Object.keys(options);
    let values = Object.values(options);
    let conditions = columns
      .map((col, index) => `${tableName}.${col} = $${index + 1}`)
      .join(" AND ");

    let query = `
    SELECT * from ${tableName} where ${conditions}`;

    try {
      return await db.oneOrNone(query, values);
    } catch (err) {
      throw new ErrorResponse(
        `Db failed in searching the record in ${tableName} ${err.message}`,
        466
      );
    }
  }
}
