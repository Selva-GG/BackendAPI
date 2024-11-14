import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

import {
  authValidator,
  loginConstraints,
  registerConstraints,
} from "../middleware/auth_validators.js";

router.post(
  "/login",
  authValidator(loginConstraints),
  userController.checkCredentials,
  (req, res) => {
    if (req.userAuth) {
      res.status(200).json({ message: " User Logged in", data: req.userAuth });
    }
  }
);

router.post(
  "/register",
  authValidator(registerConstraints),
  userController.checkUserExists,
  userController.addUserToDB,
  (req, res) => {
    res.status(201).json(req.userData);
  }
);

export default router;
