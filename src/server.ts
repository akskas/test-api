import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import routes from "./routes";
import middleware from "./middleware";
import dotenv from "dotenv";
import fs from "fs";

if (!process.env.NODE_ENV)
  process.env.NODE = 'dev';

if (fs.existsSync(".env")) {
  console.log("Using ENVs from .env file");
  console.log("test log - 2");
  dotenv.config({ path: ".env" });
} else {
  console.log("Using ENVs from .env.example file ");
  dotenv.config({ path: ".env.example" });
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  console.log("AWS_ACCESS_KEY_ID environment variable not set");
  process.exit(1);
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  console.log("AWS_SECRET_ACCESS_KEY environment variable not set");
  process.exit(1);
}

if (!process.env.AWS_S3_BUCKET_NAME) {
  console.log("AWS_S3_BUCKET_NAME environment variable not set");
  process.exit(1);
}

process.on("uncaughtException", e => {
  console.log("uncaughtException: ", e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log("unhandledRejection: ", e);
  process.exit(1);
});

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);

const { PORT = 3000 } = process.env;
const server = http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);
