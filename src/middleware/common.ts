import { Router } from "express";
import cors from "cors";
import parser from "body-parser";

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({limit: "10mb", extended: true }));
  router.use(parser.json({limit: "10mb"}));
};
