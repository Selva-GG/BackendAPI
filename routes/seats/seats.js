import express from "express";
import SeatsService from "../../service/seats.service.js";

const router = express.Router();

router.post("/book", SeatsService.book, (req, res) => {
  res.status(201).json({ message: "Seat Booked", data: req.response });
});

export default router;
