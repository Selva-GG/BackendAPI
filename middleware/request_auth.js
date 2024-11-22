import ErrorResponse from "../model/error.model.js";
import AuthRepository from "../repository/auth.repository.js";
import UserRepository from "../repository/user.repository.js";

const request_auth = async (req, res, next) => {
  let req_token = req.headers.authorization;
  try {
    if (!req_token) {
      throw new ErrorResponse("Add bearer Token to the header", 401);
    }
    let token = req_token.startsWith("Bearer ")
      ? req_token.slice(7)
      : req_token;
    let result = await AuthRepository.checkValidToken({
      access_token: token,
    });

    let timeInMIlliseconds = new Date(result.expiring_at).getTime();
    if (timeInMIlliseconds < Date.now()) {
      throw new ErrorResponse("Token Expired", 401);
    }
    req.user_id = result.user_id;
    req.access_token = result.access_token;
    next();
  } catch (err) {
    return next(err);
  }
};

export default request_auth;
