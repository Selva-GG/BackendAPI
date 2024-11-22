import express from "express";
import userService from "../../service/user.service.js";
import tryCatchWrapper from "../../util/tryCatchWrapper.js";
class UserController {
  constructor() {
    this.router = express.Router();
    this.router.post("/login", tryCatchWrapper(this.#login));
    this.router.post("/register", tryCatchWrapper(this.#register));
    this.router.post("/logout", tryCatchWrapper(this.#logout));
    this.router.post("/delete", tryCatchWrapper(this.#delete));
    this.router.patch("/refresh", tryCatchWrapper(this.#refresh));
  }

  #login = async (req, res, next) => {
    let response = await userService.loginUser(req.body);
    res.status(200).json({
      message: " User Logged in",
      response,
    });
  };

  #register = async (req, res, next) => {
    let response = await userService.registerUser(req.body);
    res.status(200).json({
      message: " New user signed up",
      response,
    });
  };

  #logout = async (req, res, next) => {
    await userService.logoutUser(req.access_token);
    return res.status(200).json({ message: "Successful logout" });
  };

  #delete = async (req, res, next) => {
    await userService.removeUser(req.user_id);
    return res.status(200).json({ message: "Successful deleted user " });
  };
  #refresh = async (req, res, next) => {
    let response = await userService.refreshToken(req.body);
    return res.status(200).json({
      message: "New Access token generated",
      response,
    });
  };
}

export default new UserController().router;
