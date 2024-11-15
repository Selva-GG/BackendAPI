import AuthRepository from "../repository/auth.repository.js";
import ErrorResponse from "../model/error.model.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export default class UserService {
  static checkUserExists = async (req, res, next) => {
    const { username, password, ...body } = req.body;
    try {
      let response = await userRepository.findUser(
        "users",
        "username",
        username
      );
      if (response) {
        throw new ErrorResponse("User Already Exists", 409);
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      const user = { username, password: hashedPassword, ...body };
      req.user = await userRepository.insert(user);
      next();
    } catch (err) {
      return next(err);
    }
  };

  static checkCredentials = async (req, res, next) => {
    const { username, password } = req.body;
    try {
      let response = await userRepository.findUser(
        "users",
        "username",
        username
      );
      if (!response) {
        throw new ErrorResponse(
          "No user exists! Check username and try again",
          403
        );
      } else {
        let userAuth =
          response.username === username &&
          (await bcrypt.compare(password, response.password));
        if (!userAuth) {
          throw new ErrorResponse("Check your password", 401);
        }
        req.user = await AuthRepository.generateAccessToken(response.user_id);

        next();
      }
    } catch (err) {
      return next(err);
    }
  };

  static logOutUser = async (req, res, next) => {
    let access_token = req.access_token;
    try {
      await userRepository.deleteUserSession(access_token);
      next();
    } catch (err) {
      next(
        new ErrorResponse("User session deletion Error " + err.message, 409)
      );
    }
  };

  static removeUser = async (req, res, next) => {
    let user_id = req.user_id;
    try {
      await userRepository.deleteUser(user_id);
      next();
    } catch (err) {
      return new ErrorResponse("User deletion error" + err.message, 409);
    }
  };
}
