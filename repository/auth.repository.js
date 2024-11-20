import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";

export default class AuthRepository {
  static async generateAccessToken(user_id) {
    let query = `
    INSERT INTO auth_token (user_id, access_token, refresh_token , expiring_at)
    VALUES ($1, gen_random_uuid(), gen_random_uuid(), NOW() + INTERVAL '1 minute')
    returning *;
    `;
    try {
      let { access_token, expiring_at } = await db.oneOrNone(query, [user_id]);
      return { access_token, expiring_at };
    } catch (err) {
      console.log("Error in in generating new token" + err);
    }
  }
  static async checkValidToken(token) {
    let tokenKey = Object.keys(token).join("");
    let tokenValue = Object.values(token).join("");
    let query = `
    SELECT 1 from auth_token where ${tokenKey} = $1
    `;
    try {
      return db.oneOrNone(query, [tokenValue]);
    } catch (err) {
      throw new ErrorResponse(
        "Db failed in checking the token " + err.message,
        466
      );
    }
  }
  static async updateAccessToken(refresh_token) {
    let query = `
    UPDATE auth_token 
    SET 
    access_token = gen_random_uuid(),
    expiring_at = NOW() + INTERVAL '1 minute'
    WHERE 
    refresh_token = $2``
    returning *;
    `;
    try {
      let { access_token, expiring_at } = await db.oneOrNone(query, [
        refresh_token,
      ]);
      return { access_token, expiring_at };
    } catch (err) {
      console.log("Error in in updating existing token" + err.message);
    }
  }
}
