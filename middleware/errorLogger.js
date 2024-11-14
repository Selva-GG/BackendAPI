import ErrorResponse from "../model/error.model.js";
import { logEvents } from "./logger.js";

export const errorLogger = (err, req, res, next) => {
  logEvents(err.message, "err.txt");
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ data: err.message });
  next();
};

