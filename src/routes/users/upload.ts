import { Request, Response } from "express";
import { Global } from "../../global";
import { ResponseCodes } from "../../utils/responseCodes";
import * as AWS from "aws-sdk";
import * as _ from "underscore";

export let upload = (req: Request, res: Response) => {
  var validateResult = validate(req.body.users);
  if (!validateResult.isValid) {
    res.status(ResponseCodes.INVALID_REQUEST).json({ errors: validateResult.errors });
  } else {
    var S3_configs = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
      apiVersion: "2006-03-01",
    };
    const s3 = new AWS.S3(S3_configs);
    const s3Data = req.body.users.map((user : any) => {
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
      if (err) {
        res.status(ResponseCodes.BAD_GATEWAY).json({ message: "Failed to save data to s3" });
      } else {
        Global.users = req.body.users;
        res.status(ResponseCodes.SUCCESS).json({ message: "Users saved successfully." });
      }

      res.send();
    });
  }
};

// validator funuction
let validate = function (users: any) {
  let result: any = {
    isValid: true,
    errors: []
  };
  let hasErrors: Boolean = false;

  if (!_.isArray(users)) {
    result.isValid = false;
    result.errors.push('Invalid request body. :users should be an array')
    return result;
  }

  let hasMissingProperties = _.some(users,
    function (u) {
      return !_.has(u, 'username') || !_.has(u, 'password') ||
        !_.has(u, 'firstName') || !_.has(u, 'lastName') ||
        !_.has(u, 'mobile') || !_.has(u, 'isActive')
    }
  )
  if (hasMissingProperties) {
    result.isValid = false;
    result.errors.push('One or the more users are missing "username", ' +
      '"password", "firstName", "lastName", "mobile" or "isActive" property');
    return result;
  }

  let invalidUsername = _.some(users,
    function (u) {
      return !_.isString(u.username) ||
        u.username.length < 5 || u.username.length > 20;
    }
  );
  if (invalidUsername) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "username". ' +
      '"username" should be a string of length between 5 to 20 inclusive');
  } else {
    let userNames = _.pluck(users, 'username');
    if (_.uniq(userNames).length !== users.length) {
      result.isValid = false;
      result.errors.push('One or the more users have duplicate "username". ' +
        '"username" should be unique');
    }
  }

  let invalidPassword = _.some(users,
    function (u) {
      return !_.isString(u.password) ||
        u.password.length < 6 || u.password.length > 20;
    }
  );
  if (invalidPassword) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "password". ' +
      '"password" should be a string of length between 5 to 20 inclusive');
  }

  let invalidFirstName = _.some(users,
    function (u) {
      return !_.isString(u.firstName) ||
        u.firstName.length < 1 || u.firstName.length > 20;
    }
  );
  if (invalidFirstName) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "firstName". ' +
      '"firstName" should be a string of length between 1 to 20 inclusive');
  }

  let invalidLastName = _.some(users,
    function (u) {
      return !_.isString(u.lastName) ||
        u.lastName.length < 1 || u.lastName.length > 20;
    }
  );
  if (invalidLastName) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "lastName". ' +
      '"lastName" should be a string of length between 1 to 20 inclusive');
  }

  let invalidMobile = _.some(users,
    function (u) {
      return !_.isNumber(u.mobile) ||
        u.mobile < Math.pow(10, 9) || u.mobile > Math.pow(10, 10);
    }
  );
  if (invalidMobile) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "mobile". ' +
      '"mobile" should be a ten digit number');
  }

  let invalidIsActive = _.some(users,
    function (u) {
      return !_.isBoolean(u.isActive);
    }
  );
  if (invalidIsActive) {
    result.isValid = false;
    result.errors.push('One or the more users have invalid "isActive". ' +
      '"isActive" should be a boolean');
  }


  return result;
}
