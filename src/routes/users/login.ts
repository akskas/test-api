import { Request, Response } from "express";
import { Global } from "../../global";

export let login = (req: Request, res: Response) => {
  var authValues = req.headers.authorization &&
    req.headers.authorization.split(" ");
  if (!authValues || authValues[0] !== "Basic" || !authValues[1]) {
    res.status(400).json({ error: "Invalid request"});
  } else {
    const decodedCreds = new Buffer(authValues[1], "base64").toString();
    const username = decodedCreds.split(":")[0];
    const password = decodedCreds.split(":")[1];

    let user = Global.users.find(u => {
        return u.username == username && u.password == password;
      }
    );

    if (!user)
      res.status(400).json({ error: "Invalid credentials"});
    else if (!user.isActive)
      res.status(401).json({ error: "Inactive user"});
    else {
      var response = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile
      };
      res.status(200).json(response);
    }
  }

  res.send();
};
