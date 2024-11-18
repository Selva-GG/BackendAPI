import express from "express";
import SeatsService from "../../service/seats.service.js";

const router = express.Router();

router.post("/book", SeatsService.book, (req, res) => {
  res.status(201).json({ message: "Seat Booked", data: req.response });
});

router.get("/", SeatsService.show, (req, res) => {
  res
    .status(201)
    .json({ message: ` Seats for Bus id : ${req.params.id}`, data: req.seats });
});

export default router;
