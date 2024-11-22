import "suppress-experimental-warnings";
import cors from 'cors'
import initializeRoutes from "./util/initializeRoutes.js";
import { errorHandler } from "./middleware/errorLogger.js";
import express from "express";
const port = 3000;
const server = express();


server.use(cors());
server.use(express.json());

await initializeRoutes(server);
server.use(errorHandler);

server.listen(port, (req, res) => {
  console.log("Server running on port " + port);
});
