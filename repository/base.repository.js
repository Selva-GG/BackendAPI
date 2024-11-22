import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class BaseRepository {
  static async unique(tableName, options, err, onExisting) {
    let columns = Object.keys(options);
    let values = Object.values(options);
    let conditions = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(" AND ");

    let query = `
    SELECT * from ${tableName} where ${conditions}`;

    try {
      let response = await db.oneOrNone(query, values);
      if (!response && !onExisting) {
        throw new ErrorResponse(err ? err : "No records found", 403);
      } else if (onExisting) {
        throw new ErrorResponse(err ? err : "Record is present", 409);
      }
      return response;
    } catch (err) {
      throw new ErrorResponse(
        `DB failed in searching the record in ${tableName} ${err.message}`,
        409
      );
    }
  }
}
