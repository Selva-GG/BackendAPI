import recursive from "recursive-readdir";
import { fileURLToPath, pathToFileURL } from "url";
import request_auth from "../middleware/request_auth.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import open_api_validator from "openapi-validator-middleware";

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

  open_api_validator.init(currentSwaggerDoc);
  const swaggerValidation =
    open_api_validator.getNewMiddleware(currentSwaggerDoc);
  return swaggerValidation;
}

async function initializeRoutes(
  routePath,
  baseRoute,
  server,
  swaggerValidation
) {
  console.log(`\x1b[32mAssigning routes for: /${baseRoute}\x1b[0m`);
  const { default: apiRoutes } = await import(pathToFileURL(routePath));

  apiRoutes.stack.forEach((route) => {
    if (route.route) {
      const apiPath = route.route.path;
      if (!["/login", "/register", "/refresh", "/addAdmin"].includes(apiPath)) {
        server.use(`/${baseRoute}${apiPath}`, request_auth);
      }
      server.all(`/${baseRoute}${apiPath}`, swaggerValidation.validate);
    }
  });
  server.use(`/${baseRoute}`, apiRoutes);
}

async function initializeMiddleware(server) {
  console.log("\n\x1b[33mInstalling routes:\x1b[0m");

  try {
    const routes = await recursive("./routes", ["*.swagger.json"]);

    for (const routePath of routes) {
      const fileName = path.basename(routePath);
      const baseRoute = fileName.split(".").slice(0, 1);

      //Initializing Swagger
      const parentDirectory = path.dirname(routePath);
      const swaggerPath = (await recursive(parentDirectory, ["*.js"]))[0];
      const swaggerValidation = await initializeSwagger(
        swaggerPath,
        baseRoute,
        server
      );

      //Initializing Routes
      await initializeRoutes(routePath, baseRoute, server, swaggerValidation);
    }
    // Setup Swagger UI
    server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, options));
    console.log(
      "\x1b[32mSwagger documentation available at: http://192.168.1.13:3000/api-docs\x1b[m"
    );
  } catch (err) {
    console.error("\x1b[31mError initializing routes:\x1b[0m", err);
  }
}

export default initializeMiddleware;
