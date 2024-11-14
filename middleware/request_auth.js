import ErrorResponse from "../model/error.model.js";
import authRepository from "../repository/auth.repository.js";

const request_auth = async (req, res, next) => {
  let req_token = req.headers.authorization;
  let token = req_token.startsWith("Bearer ") ? req_token.slice(7) : req_token;
  try {
    if (!token) {
      throw new ErrorResponse("Invalid token", 401);
    }
    let result = await authRepository.find("auth_token", "access_token", token);
    if (!result[0]) {
      throw new ErrorResponse("Invalid Token", 404);
    }

    let timeInMIlliseconds = new Date(result[0].expiring_at).getTime();
    if (timeInMIlliseconds < Date.now()) {
      req.user = await authRepository.generateNewAccessToken(
        result[0].refresh_token
      );
      return res.status(201).json({ message: req.user });
    }
    return res.status(200).json({ message: "next task" });
  } catch (err) {
    return next(err);
  }
};

export default request_auth;
