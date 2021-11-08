const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");

const validateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let result;
  if (authorizationHeader) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>

    try {
      result = jwt.verify(token, process.env.JWT_KEY);

      req.decoded = result;
      console.log("token verified", result);
      // res.json({message:result});

      next();
    } catch (err) {
      console.log(err);
      responseUtil.internalServerError(
        res,
        responseMessage.error.invalidToken,
        err
      );
    }
  } else {
    responseUtil.unauthorized(res, responseMessage.error.tokenEmpty, null);
  }
};

module.exports = { validateToken };
