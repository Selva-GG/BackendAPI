import express from "express";
import userService from "../service/user.service.js";
import requestAuth from "../middleware/request_auth.js";
const router = express.Router();

import {
  request_validator,
  loginConstraints,
  registerConstraints,
} from "../middleware/request_validator.js";

router.post(
  "/login",
  request_validator(loginConstraints),
  userService.checkCredentials,
  (req, res) => {
    res.status(200).json({ message: " User Logged in", data: req.user });
  }
);

router.post(
  "/register",
  request_validator(registerConstraints),
  userService.checkUserExists,
  (req, res) => {
    res
      .status(201)
      .json({ access_token: req.user.access_token, user: req.user.user });
  }
);

router.post("/logout", requestAuth, userService.logOutUser, (req, res) => {
  return res.status(200).json({ message: "Successful logout" });
});

router.post("/delete", requestAuth, userService.removeUser, (req, res) => {
  return res
    .status(200)
    .json({ message: "Successful deleted user " + req.user });
});

router.post("/refresh");

export default router;
