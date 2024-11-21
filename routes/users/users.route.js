import express from "express";
import userService from "../../service/user.service.js";
const router = express.Router();

router.post("/login", userService.checkCredentials, (req, res) => {
  res.status(200).json({
    message: " User Logged in",
    access_token: req.user.access_token,
    user: req.user.user,
  });
});

router.post("/register", userService.checkUserExists, (req, res) => {
  res.status(201).json({
    message: " New user signed up",
    access_token: req.user.access_token,
    user: req.user.user,
  });
});

router.post("/logout", userService.logOutUser, (req, res) => {
  return res.status(200).json({ message: "Successful logout" });
});

router.post("/delete", userService.removeUser, (req, res) => {
  return res
    .status(200)
    .json({ message: "Successful deleted user " + req.user });
});

router.patch("/refresh", userService.refreshToken, (req, res) => {
  return res
    .status(201)
    .json({ message: "New Access token generated", data: req.new_token });
});

export default router;
