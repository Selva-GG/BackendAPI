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

  static async updateAccessToken(user_id, refresh_token) {
    let query = `
    UPDATE auth_token 
    SET 
    access_token = gen_random_uuid(),
    expiring_at = NOW() + INTERVAL '1 minute'
    WHERE 
    user_id = $1 and refresh_token = $2
    returning *;
    `;
    try {
      let { access_token, expiring_at } = await db.oneOrNone(query, [
        user_id,
        refresh_token,
      ]);
      return { access_token, expiring_at };
    } catch (err) {
      console.log("Error in in updating existing token" + err.message);
    }
  }
}
