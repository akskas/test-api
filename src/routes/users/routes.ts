import { Request, Response } from "express";

import { upload } from "./upload";
import { login } from "./login";

export default [
  /*
    POST /users
    expects users property in request body
  */
  {
    path: "/users",
    method: "post",
    handler: async (req: Request, res: Response) => {
      return upload(req, res);
    }
  },
  /*
    POST /login
    authorization header should have base64 encoded username and password
  */
  {
    path: "/login",
    method: "post",
    handler: async (req: Request, res: Response) => {
      return login(req, res);
    }
  }
];
