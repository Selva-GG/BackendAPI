import AuthRepository from "../repository/auth.repository.js";
import ErrorResponse from "../model/error.model.js";
import userRepository from "../repository/user.repository.js";
import dateFormat from "date-format";
import bcrypt from "bcrypt";

export default class UserService {
  static async registerUser(data) {
    const { username, password, ...body } = data;

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
  }

  static async loginUser(data) {
    const { username, password } = data;

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
  }

  static async logoutUser(access_token) {
    await userRepository.deleteUserSession(access_token);
  }

  static async removeUser(user_id) {
    await userRepository.deleteUser(user_id);
  }

  static async refreshToken(refresh_token) {
    let validToken = await AuthRepository.checkValidToken({ refresh_token });
    let timeInMIlliseconds = new Date(validToken.expiring_at).getTime();
    if (timeInMIlliseconds > Date.now()) {
      let response = {
        message: "Existing Token is not expired",
        token: {
          access_token: validToken.access_token,
          expiring_at: dateFormat(
            "dd-mm-yyyy hh:mm:ss",
            validToken.expiring_at
          ),
        },
      };
      throw new ErrorResponse(response, 409);
    }

    return await AuthRepository.updateAccessToken(refresh_token);
  }
}
