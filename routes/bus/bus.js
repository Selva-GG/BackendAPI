import express from "express";
import BusService from "../../service/bus.service.js";
import swaggerValidation from "openapi-validator-middleware";
import swagger from "./bus.swagger.json" assert { type: "json" };
import request_auth from "../../middleware/request_auth.js";

const router = express.Router();

const busValidation = swaggerValidation.getNewMiddleware(swagger);

router.use(request_auth);

router.post(
  "/create",
  busValidation.validate,
  BusService.insertBus,
  (req, res) => {
    res.status(201).json({ message: "Bus is created", bus: req.bus });
  }
);

router.post(
  "/search",
  busValidation.validate,
  BusService.searchBus,
  (req, res) => {
    res.status(201).json({ message: " Searched Bus", data: req.bus });
  }
);

router.get("/", busValidation.validate, BusService.showAllBuses, (req, res) => {
  res.status(201).json({ message: " Buses", data: req.buses });
});

router.post(
  "/seats",
  busValidation.validate,
  BusService.showSeatDetails,
  (req, res) => {
    res
      .status(201)
      .json({
        message: ` Seats for Bus id : ${req.params.id}`,
        data: req.seats,
      });
  }
);

export default router;
