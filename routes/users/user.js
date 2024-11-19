import express from "express";
import userService from "../../service/user.service.js";
import requestAuth from "../../middleware/request_auth.js";
import swaggerValidation from "openapi-validator-middleware";
import swagger from "./user.swagger.json" assert { type: "json" };
const router = express.Router();

const userValidation = swaggerValidation.getNewMiddleware(swagger);

router.post(
  "/login",
  userValidation.validate,
  userService.checkCredentials,
  (req, res) => {
    res.status(200).json({
      message: " User Logged in",
      access_token: req.user.access_token,
      user: req.user.user,
    });
  }
);

router.post(
  "/register",
  swaggerValidation.validate,
  userService.checkUserExists,
  (req, res) => {
    res.status(201).json({
      message: " New user signed up",
      access_token: req.user.access_token,
      user: req.user.user,
    });
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
