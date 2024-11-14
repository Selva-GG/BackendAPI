import pool from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

async function insertAuthToken(user_id) {
  let query = `
    INSERT INTO auth_token (user_id , access_token , refresh_token)
    Values($1 , gen_random_uuid() , gen_random_uuid())
    `;
  try {
    let result = await pool.query(query, [user_id]);
  } catch (err) {
    throw new ErrorResponse(`Database query failed: ${err.message}`, 466);
  }
}

export default class AuthRepository {
  static async insert(data) {
    const { username, password, ...userDetails } = data;
    const userJsonData = JSON.stringify({ username, password });
    const userDetailsJsonData = JSON.stringify(userDetails);

    const query = ` 

    WITH user_data as (
      Select * from json_populate_record(NULL::users , $1::json)
    ),
    user_details_data as (
      Select * from json_populate_record(NULL::user_details , $2::json)
    ),
    insert_user_data as (
      insert into users(username , password)
      select username , password from user_data
      returning *
    )
      insert into user_details(user_id , firstname , lastname , mobile , address)
      select iud.user_id , udd.firstname , udd.lastname , udd.mobile , udd.address
      from insert_user_data as iud, user_details_data as udd
      returning *;
    `;
    try {
      const result = await pool.query(query, [
        userJsonData,
        userDetailsJsonData,
      ]);
      await insertAuthToken(result.rows[0].user_id);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database insertion failed: ${err.message}`);
    }
  }

  static async find(tableName, columnName, param) {
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} = $1 LIMIT 1`;
    try {
      const result = await pool.query(query, [param]);
      return result.rows;
    } catch (err) {
      throw new ErrorResponse(`Database query failed: ${err.message}`, 466);
    }
  }
  static async returnUserData(user_id) {
    let query = `SELECT * 
        FROM users 
        JOIN user_details ON users.user_id = user_details.user_id 
        LEFT JOIN auth_token ON users.user_id = auth_token.user_id 
        WHERE users.user_id = $1;
    `;
    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  static async generateNewAccessToken(refreshToken) {
    let query = `
    UPDATE auth_token 
    SET 
    access_token = gen_random_uuid(),
    expiring_at = NOW() +  INTERVAL '1 minute'
    WHERE 
    refresh_token = $1
    RETURNING *;   `;
    try {
      let result = await pool.query(query, [refreshToken]);
      return result.rows[0].access_token;
    } catch (err) {
      console.log("Error in in generating new token" + err);
    }
  }
}
