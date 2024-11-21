import recursive from "recursive-readdir";
import { fileURLToPath, pathToFileURL } from "url";
import request_auth from "../middleware/request_auth.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeRoutes(server) {
  const options = {
    explorer: true,
    swaggerOptions: {
      urls: [],
    },
  };
  console.log("\n\x1b[33mInstalling routes:");

  try {
    let routesDir = findRoutesDir();
    let routes = await recursive(routesDir);

    for (const filePath of routes) {
      const splitPath = filePath.split(path.sep).pop();
      const baseRoute = splitPath.split(".")[0];

      //Assigning routes
      if (splitPath.includes("route")) {
        console.log(`Assigning routes for  ${baseRoute}`);
        const { default: apiRoutes } = await import(pathToFileURL(filePath));
        server.use(`/${baseRoute}`, apiRoutes);

        apiRoutes.stack.forEach((route) => {
          if (route.route) {
            const apiPath = route.route.path;
            if (
              !["/login", "/register", "/refresh", "/addAdmin"].includes(
                apiPath
              )
            ) {
              //Using authentication middleware
              server.use(`/${baseRoute}${apiPath}`, request_auth);
            }
          }
        });
      }

      //Creating a swagger api-docs
      if (splitPath.includes("swagger")) {
        console.log(`Pushing swagger doc of ${baseRoute}`);
        const { default: currentSwaggerDoc } = await import(
          pathToFileURL(filePath),
          {
            assert: { type: "json" },
          }
        );
        let swaggerPath = `/${baseRoute}-swagger`;
        server.get(swaggerPath, (req, res) => res.send(currentSwaggerDoc));
        options.swaggerOptions.urls.push({
          url: swaggerPath,
          name: currentSwaggerDoc.info.title,
        });
      }
    }
    server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, options));
  } catch (err) {
    console.error("Error initializing routes:", err);
  }
}

function findRoutesDir() {
  let currentDir = __dirname;

  while (currentDir) {
    const potentialRoutesDir = path.join(currentDir, "routes");
    if (
      fs.existsSync(potentialRoutesDir) &&
      fs.statSync(potentialRoutesDir).isDirectory()
    ) {
      return potentialRoutesDir;
    }

    // Move one directory up
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break; // Reached the root directory
    }
    currentDir = parentDir;
  }

  throw new Error("Routes directory not found!");
}

export default initializeRoutes;
