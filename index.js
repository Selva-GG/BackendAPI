import { errorHandler } from "./middleware/errorLogger.js";
const port = 3000;

import express from "express";
const server = express();
import initializeRoutes from "./util/initializeRoutes.js";

server.use(express.json());

await initializeRoutes(server);
server.use(errorHandler);

server.listen(port, (req, res) => {
  console.log("Server running on port " + port);
});
