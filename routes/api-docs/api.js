import express from "express";
import swaggerUi from "swagger-ui-express";
import usersSwagger from "../users/user.swagger.json" assert { type: "json" };
import bookingSwagger from "../booking/booking.swagger.json" assert { type: "json" };

const router = express.Router();

router.get("/user", (req, res) => {
  res.send(usersSwagger);
});
router.get("/booking", (req, res) => {
  res.send(bookingSwagger);
});

var options = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: "http://localhost:3000/api-docs/user",
        name: "Users",
      },
      {
        url: "http://localhost:3000/api-docs/booking",
        name: "Booking",
      },
    ],
  },
};

router.use("/", swaggerUi.serve, swaggerUi.setup(null, options));

export default router;
