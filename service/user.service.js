import AuthRepository from "../repository/auth.repository.js";
import ErrorResponse from "../model/error.model.js";
import userRepository from "../repository/user.repository.js";
import dateFormat from "date-format";
import bcrypt from "bcrypt";

export default class UserService {
  static async registerUser(data) {
    const { username, password, ...body } = data;

    try {
      await userRepository.findUser({ username }, "User Already Exists", true);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepository.insert({
        username,
        password: hashedPassword,
        ...body,
      });
      return {
        access_token: await AuthRepository.generateAccessToken(user.user_id),
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  static async loginUser(data) {
    const { username, password } = data;

    try {
      const user = await userRepository.findUser(
        { username },
        "Invalid username"
      );
      if (!(await bcrypt.compare(password, user.password))) {
        throw new ErrorResponse("Invalid  password", 403);
      }

      return {
        access_token: await AuthRepository.generateAccessToken(user.user_id),
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  static async logoutUser(access_token) {
    try {
      await userRepository.deleteUserSession(access_token);
    } catch (err) {
      throw err;
    }
  }

  static async removeUser(user_id) {
    try {
      await userRepository.deleteUser(user_id);
    } catch (err) {
      throw err;
    }
  }

  static async refreshToken(refresh_token) {
    try {
      let validToken = await AuthRepository.checkValidToken(refresh_token);
      let timeInMIlliseconds = new Date(validToken.expiring_at).getTime();
      if (timeInMIlliseconds > Date.now()) {
        return {
          message: "Existing Token is not expired",
          token: {
            access_token: validToken.access_token,
            expiring_at: dateFormat(
              "dd-mm-yyyy hh:mm:ss",
              validToken.expiring_at
            ),
          },
        };
      }
      return await AuthRepository.updateAccessToken(
        refresh_token
      );
    } catch (err) {
      throw err
    }
  }
}
