import express from "express";
import AdminService from "../../service/admin.service.js";

const router = express.Router();

router.post("/addRoute", AdminService.addRoute, (req, res) => {
  res.status(201).json({ message: "New route added", data: req.new_route });
});

router.post("/createBus", AdminService.insertBus, (req, res) => {
  res.status(201).json({ message: "Bus is created", bus: req.bus });
});

router.post("/assign", AdminService.assignRoute, (req, res) => {
  res.status(201).json({
    message: " Assigned the bus to the route ",
    data: req.assignedRoute,
  });
});

router.get("/show-buses", AdminService.showAllBuses, (req, res) => {
  res.status(201).json({ message: " Buses", data: req.buses });
});

export default router;
