import pool from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class DBController {
  static select(tableName, columnName, values) {
    pool.query(`SELECT (${columnName}) from ${tableName}`);
  }

  static async insert(data) {
    const { username, password, ...userDetails } = data;
    const keys = Object.keys(userDetails);
    const columns = keys.join(", ");
    const jsonRecord = `
    
    With user_cred_insert as (
    INSERT INTO users (username , password)
    SELECT username , password
    FROM jsonb_populate_record(NULL::users, $1::jsonb)
    RETURNING password
    )
    INSERT INTO user_details (user_id, ${columns})
SELECT user_id, ${columns}
FROM user_cred_insert , jsonb_populate_record(NULL::user_details, $2::jsonb)
RETURNING  user_details.address;
     `;
    try {
      const jsonData = JSON.stringify(userDetails);
      const result = await pool.query(jsonRecord, [
        JSON.stringify({ username, password }),
        jsonData,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database insertion failed: ${err.message}`);
    }
  }

  static async insertUserDetails(data) {
    const keys = Object.keys(data);

    const columns = keys.join(", ");
    const jsonRecord = `
    
    INSERT INTO user_details(${columns})
    SELECT ${columns}
    FROM jsonb_populate_record(NULL::user_details, $1::jsonb)
    RETURNING *; `;
    try {
      const jsonData = JSON.stringify(data);
      const result = await pool.query(jsonRecord, [jsonData]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database insertion failed: ${err.message}`);
    }
  }

  static async find(columnName, param) {
    const query = `SELECT * FROM users WHERE ${columnName} = $1 LIMIT 1`;
    try {
      const result = await pool.query(query, [param]);
      return result;
    } catch (err) {
      throw new ErrorResponse(`Database query failed: ${err.message}`, 466);
    }
  }
}
