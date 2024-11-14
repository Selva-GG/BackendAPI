import { use } from "bcrypt/promises.js";
import db from "../db/db.js";
import ErrorResponse from "../model/error.model.js";
import authRepository from "../repository/auth.repository.js";
import bcrypt from "bcrypt";

async function addUserToDB(req_body) {
  const { password, ...body } = req_body;
  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    const user = { password: hashedPassword, ...body };
    return await authRepository.insert(user);
  } catch (err) {
    return err;
  }
}

async function setUser(user_id) {
  let result = await authRepository.returnUserData(user_id);
  req.user = result;
}
export default class UserController {
  static checkUserExists = async (req, res, next) => {
    const { username } = req.body;
    try {
      let response = await authRepository.find("users", "username", username);
      if (response.length == 1) {
        throw new ErrorResponse("User Already Exists", 409);
      }
      let dbRes = await addUserToDB(req.body);
      setUser(dbRes.user_id);
      next();
    } catch (err) {
      return next(err);
    }
  };

  static checkCredentials = async (req, res, next) => {
    const { username, password } = req.body;
    try {
      let response = await authRepository.find("users", "username", username);
      if (response.length === 0) {
        throw new ErrorResponse(
          "No user exists! Check username and try again",
          403
        );
      } else {
        let userAuth =
          response[0].username === username &&
          (await bcrypt.compare(password, response[0].password));
        if (!userAuth) {
          throw new ErrorResponse("Check your password", 401);
        }
        setUser(response[0].user_id);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
