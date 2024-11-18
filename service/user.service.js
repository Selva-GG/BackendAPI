import AuthRepository from "../repository/auth.repository.js";
import ErrorResponse from "../model/error.model.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export default class UserService {
  static checkUserExists = async (req, res, next) => {
    const { username, password, ...body } = req.body;

    try {
      (await userRepository.findUser("users", "username", username))
        ? next(new ErrorResponse("User Already Exists", 409))
        : null;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepository.insert({
        username,
        password: hashedPassword,
        ...body,
      });
      req.user = {
        access_token: await AuthRepository.generateAccessToken(user.user_id),
        user,
      };

      next();
    } catch (err) {
      next(err);
    }
  };

  static checkCredentials = async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await userRepository.findUser("users", "username", username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new ErrorResponse("Invalid username or password", 403));
      }

      req.user = {
        access_token: await AuthRepository.generateAccessToken(user.user_id),
        user,
      };

      next();
    } catch (err) {
      next(err);
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