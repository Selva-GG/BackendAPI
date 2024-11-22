import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";
import BaseRepository from "./base.repository.js";

export default class AuthRepository extends BaseRepository {
  static async generateAccessToken(user_id) {
    let query = `
    INSERT INTO auth_token (user_id, access_token, refresh_token, expiring_at)
VALUES ($1, gen_random_uuid(), gen_random_uuid(), NOW() + INTERVAL '5 minutes')
RETURNING *, TO_CHAR(expiring_at, 'dd-mm-yyyy hh24:mi:ss') AS expiring_at;

    `;
    try {
      let { access_token, expiring_at } = await db.oneOrNone(query, [user_id]);
      return { access_token, expiring_at };
    } catch (err) {
      throw new ErrorResponse(
        "DB Error in in generating new token" + err.message,
        409
      );
    }
  }

  static async checkValidToken(token) {
    return this.unique("auth_token", token, "Invalid Token");
  }
  static async updateAccessToken(refresh_token) {
    let query = `
    UPDATE auth_token
SET 
    access_token = gen_random_uuid(),
    expiring_at = NOW() + INTERVAL '5 minutes'
WHERE 
    refresh_token = $1 
RETURNING *, TO_CHAR(expiring_at, 'dd-mm-yyyy hh24:mi:ss') AS expiring_at ;
 ;
    `;
    try {
      let { access_token, expiring_at } = await db.oneOrNone(query, [
        refresh_token,
      ]);
      return { access_token, expiring_at };
    } catch (err) {
      throw new ErrorResponse(
        "DB Error in in updating existing token " + err.message,
        409
      );
    }
  }
}
