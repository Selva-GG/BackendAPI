import SeatsRepository from "../repository/seats.repository.js";

export default class SeatsService {
  static book = async (req, res, next) => {
      let { seat_id, bus_id } = req.body;
      try {
        let response = await SeatsRepository.Book(bus_id, seat_id);
        console.log(response);
        if (!response) {
          res
            .status(405)
            .json({ message: "Error occurred while booking the seat" });
        }
        req.response = response;
        next();
      } catch (err) {
        return next(err);
      }
    };
  }

