import express from "express";
import BusService from "../../service/bus.service.js";

const router = express.Router();

router.post("/create", BusService.insertBus, (req, res) => {
  res.status(201).json({ message: "Bus is created", bus: req.bus });
});

router.get("/search", BusService.searchBus, (req, res) => {
  res.status(201).json({ message: " Searched Bus", data: req.bus });
});

router.get("/", BusService.showAllBuses, (req, res) => {
  res.status(201).json({ message: " Buses", data: req.buses });
});

export default router;
