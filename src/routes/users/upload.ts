import { Request, Response } from "express";
import { Global } from "../../global";
import * as AWS from "aws-sdk";

export let upload = (req: Request, res: Response) => {
  if (!req.body.users || !req.body.users.length) {
    res.status(400).json({ error: "Invalid request body. users should be an array." });
  } else {
    const users = req.body.users;
    Global.users = req.body.users;

    var S3_configs = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
      apiVersion: "2006-03-01",
    };
    const s3 = new AWS.S3(S3_configs);

    const s3Data = users.map((user: any) => {
      return {
        username: user.username,
        isActive: user.isActive
      }
    });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: new Date().getTime() + "/users.json",
      Body: JSON.stringify(s3Data),
      ContentType: "application/json",
      ACL: "public-read"
    };

    s3.upload(params, (err: Error) => {
      if (err)
        res.status(500).json({ message: "Failed to save data to s3" });
      else
        res.status(200).json({ message: "Users saved successfully." });

      res.send();
    });
  }
};
