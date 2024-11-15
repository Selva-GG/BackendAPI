import db from "../db/db.js";
import AuthRepository from "./auth.repository.js";
import ErrorResponse from "../model/error.model.js";


export default class UserRepository {
  static async findUser(tableName, columnName, param) {
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} = $1 LIMIT 1`;
    try {
      return await db.oneOrNone(query, [param]);
    } catch (err) {
      throw new ErrorResponse(`Database query failed: ${err.message}`, 466);
    }
  }

  static async deleteUserSession(access_token) {
    let query = `Delete from auth_token where access_token  = $1`;
    try {
      await db.oneOrNone(query, [access_token]);
    } catch (err) {
      return "DBError" + err.message;
    }
  }

  static async deleteUser(user_id) {
    let query = `Delete from users where user_id  = $1`;
    try {
      await db.oneOrNone(query, [user_id]);
    } catch (err) {
      return "DBError" + err.message;
    }
  }
  static async insert(data) {
    const { username, password, ...userDetails } = data;
    const userJsonData = JSON.stringify({ username, password });
    const userDetailsJsonData = JSON.stringify(userDetails);

    const query =
      //Query for insertion of user's primitive data , user's details , and their token data
      `
   WITH user_data AS (
    SELECT * FROM json_populate_record(NULL::users, $1::json)
  ),
  user_details_data AS (
    SELECT * FROM json_populate_record(NULL::user_details, $2::json)
  ),
  insert_user_data AS (
    INSERT INTO users (username, password)
    SELECT username, password FROM user_data
    RETURNING user_id
  )
    INSERT INTO user_details (user_id, firstname, lastname, mobile, address)
    SELECT iud.user_id, udd.firstname, udd.lastname, udd.mobile, udd.address
    FROM insert_user_data AS iud, user_details_data AS udd
    RETURNING *;
    `;

    try {
      let result = await db.one(query, [userJsonData, userDetailsJsonData]);
      let access_token = await AuthRepository.generateAccessToken(
        result.user_id
      );
      return { access_token: access_token, user: result };
    } catch (err) {
      throw new Error(`Database insertion failed: ${err.message}`);
    }
  }
}
