import express from "express";
import authService from "../service/auth.service.js";
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
  authService.checkCredentials,
  (req, res) => {
    if (req.userAuth) {
      res.status(200).json({ message: " User Logged in", data: req.user });
    }
  }
);

router.post("/test", requestAuth);

router.post(
  "/register",
  request_validator(registerConstraints),
  authService.checkUserExists,
  (req, res) => {
    res.status(201).json({ message: " User Registered", data: req.user });
  }
);

export default router;
