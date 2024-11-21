import recursive from "recursive-readdir";
import { fileURLToPath, pathToFileURL } from "url";
import request_auth from "../middleware/request_auth.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import swaggerValidation from "openapi-validator-middleware";
import api from "suppress-experimental-warnings";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {
  explorer: true,
  swaggerOptions: {
    urls: [],
  },
};

async function initializeSwagger(swaggerPath, baseRoute, server) {
  console.log(`\x1b[36mAdding Swagger doc for: /${baseRoute}\x1b[0m`);
  const { default: currentSwaggerDoc } = await import(
    pathToFileURL(swaggerPath),
    {
      assert: { type: "json" },
    }
  );
  const routePath = `/${baseRoute}-swagger`;
  server.get(routePath, (req, res) => res.json(currentSwaggerDoc));
  options.swaggerOptions.urls.push({
    url: routePath,
    name: currentSwaggerDoc.info.title,
  });

  swaggerValidation.init(currentSwaggerDoc);
  const userValidation = swaggerValidation.getNewMiddleware(currentSwaggerDoc);
  return userValidation;
}

async function initializeRoutes(userValidation, baseRoute, filePath, server) {
  console.log(`\x1b[32mAssigning routes for: /${baseRoute}\x1b[0m`);
  const { default: apiRoutes } = await import(pathToFileURL(filePath));

  // Apply middleware for all non-authentication endpoints
  apiRoutes.stack.forEach((route) => {
    if (route.route) {
      const apiPath = route.route.path;
      if (!["/login", "/register", "/refresh", "/addAdmin"].includes(apiPath)) {
        server.use(`/${baseRoute}${apiPath}`, request_auth);
      }
      server.all(`/${baseRoute}${apiPath}`, userValidation.validate);
    }
  });
  server.use(`/${baseRoute}`, apiRoutes);
}

async function initializeMiddleware(server) {
  console.log("\n\x1b[33mInstalling routes:\x1b[0m");

  try {
    const routes = await recursive("./routes", ["*.swagger.json"]);

    for (const filePath of routes) {
      const parentDirectory = path.dirname(filePath);
      const swaggerPath = await recursive(parentDirectory, ["*.js"]);
      const fileName = path.basename(filePath);
      const baseRoute = fileName.split(".").slice(0, 1);
      const userValidation = await initializeSwagger(
        swaggerPath[0],
        baseRoute,
        server
      );
      await initializeRoutes(userValidation, baseRoute, filePath, server);
      // Setup Swagger UI
      server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, options));
      console.log(
        "\x1b[32mSwagger documentation available at: http://192.168.1.13:3000/api-docs\x1b[m"
      );
    }
  } catch (err) {
    console.error("\x1b[31mError initializing routes:\x1b[0m", err);
  }
}

export default initializeMiddleware;
