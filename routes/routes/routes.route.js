import express from "express";
import RoutesService from "../../service/routes.service.js";

const router = express.Router();

router.post("/add", RoutesService.addRoute, (req, res) => {
  res.status(201).json({ message: "New route added", data: req.new_route });
});

router.post("/assign", RoutesService.assignRoute, (req, res) => {
  res.status(201).json({
    message: " Assigned the bus to the route ",
    data: req.assignedRoute,
  });
});

router.post("/", RoutesService.search, (req, res) => {
  res.status(201).json({
    message: " Buses in the specified route",
    data: req.buses,
  });
});

export default router;
