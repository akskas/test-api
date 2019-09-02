import { Request, Response } from "express";
import { Global } from "../../global";
import { ResponseCodes } from "../../utils/responseCodes";

export let login = (req: Request, res: Response) => {
  var authValues = req.headers.authorization &&
    req.headers.authorization.split(" ");
  if (!authValues || authValues[0] !== "Basic" || !authValues[1]) {
    res.status(ResponseCodes.INVALID_REQUEST).json({ errors: ["Invalid request"]});
  } else {
    const decodedCreds = new Buffer(authValues[1], "base64").toString();
    const username = decodedCreds.split(":")[0];
    const password = decodedCreds.split(":")[1];

    let user = Global.users.find(u => {
        return u.username == username && u.password == password;
      }
    );

    if (!user)
      res.status(ResponseCodes.UNAUTHORIZED).json({ errors: ["Invalid credentials. username or password is incorrect."]});
    else if (!user.isActive)
      res.status(ResponseCodes.USER_BLOCKED).json({ errors: ["Inactive user."]});
    else {
      var response = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile
      };
      res.status(ResponseCodes.SUCCESS).json(response);
    }
  }

  res.send();
};
