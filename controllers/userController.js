import ErrorResponse from "../model/error.model.js";
import DBController from "../controllers/DBController.js";
import bcrypt from "bcrypt";

export default class UserController {
  static checkCredentials = async (req, res, next) => {
    const { username, password } = req.body;
    try {
      let response = await DBController.find("username", username);
      if (response.rows.length === 0) {
        throw new ErrorResponse(
          "No user exists! Check username and try again",
          403
        );
      } else {
        let userAuth =
          response.rows[0].username === username &&
          (await bcrypt.compare(password, response.rows[0].password));
        if (!userAuth) {
          throw new ErrorResponse("Check your password", 401);
        }
        req.userAuth = response.rows[0];
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  static checkUserExists = async (req, res, next) => {
    const { username } = req.body;
    try {
      let response = await DBController.find("username", username);
      if (response.rows.length >= 1) {
        throw new ErrorResponse("User Already Exists", 409);
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  static addUserToDB = async (req, res, next) => {
    const { password, ...body } = req.body;
    try {
      let hashedPassword = await bcrypt.hash(password, 10);
      const user = { password: hashedPassword, ...body };
      let userRes = await DBController.insert(user);

      req.userData = { ...userRes };
      next();
    } catch (err) {
      next(err);
    }
  };
}
