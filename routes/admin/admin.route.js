import express from "express";
import adminService from "../../service/admin.service.js";
import Validator from "../../util/validator.js";
import tryCatchWrapper from "../../util/tryCatchWrapper.js";

class AdminController {
  constructor() {
    this.router = express.Router();
    this.router.use(tryCatchWrapper(this.#adminMiddleware));
    this.router.post("/addAdmin", tryCatchWrapper(this.#addAdmin));
    this.router.post("/addRoute", tryCatchWrapper(this.#addRoute));
    this.router.post("/createBus", tryCatchWrapper(this.#insertBus));
    this.router.post("/assign", tryCatchWrapper(this.#assignRoute));
    this.router.get("/show-buses", tryCatchWrapper(this.#showBuses));
  }

  #adminMiddleware = async (req, res, next) => {
    await Validator.isAdmin(req.user_id);
    next();
  };
  #addAdmin = async (req, res) => {
    let user = await adminService.createAdmin(req.body);
    res.status(200).json({
      message: " New admin user signed up",
      user,
    });
  };
  #addRoute = async (req, res) => {
    let newRoute = await adminService.addRoute(req.body);
    res.status(201).json({ message: "New route added", newRoute });
  };
  #insertBus = async (req, res) => {
    let newBus = adminService.insertBus(req.body);
    res.status(201).json({ message: "Bus is created", newBus });
  };
  #assignRoute = async (req, res) => {
    let assignedRoute = await adminService.assignRoute(req.body);
    res.status(201).json({
      message: " Assigned the bus to the route ",
      assignedRoute,
    });
  };
  #showBuses = async (req, res) => {
    let buses = await adminService.showAllBuses();
    res.status(201).json({ message: " Buses", buses });
  };
}

export default new AdminController().router;
