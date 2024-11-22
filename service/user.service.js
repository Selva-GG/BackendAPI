import AuthRepository from "../repository/auth.repository.js";
import ErrorResponse from "../model/error.model.js";
import userRepository from "../repository/user.repository.js";
import dateFormat from "date-format";
import bcrypt from "bcrypt";

export default class UserService {
  static checkUserExists = async (req, res, next) => {
    const { username, password, ...body } = req.body;

    try {
      await userRepository.findUser(
        {
          username,
        },
        "User Already Exists",
        true
      );

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
      const user = await userRepository.findUser({ username });
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

  static refreshToken = async (req, res, next) => {
    try {
      let validToken = await AuthRepository.checkValidToken(req.body);
      let timeInMIlliseconds = new Date(validToken.expiring_at).getTime();
      if (timeInMIlliseconds > Date.now()) {
        return res.status(409).json({
          message: "Existing Token is not expired",
          token: {
            access_token: validToken.access_token,
            expiring_at: dateFormat(
              "dd-mm-yyyy hh:mm:ss",
              validToken.expiring_at
            ),
          },
        });
      }
      req.new_token = await AuthRepository.updateAccessToken(
        req.body.refresh_token
      );
      next();
    } catch (err) {
      return next(err);
    }
  };
}
