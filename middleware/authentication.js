const User = require("../models/userModel");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const { JWT } = require("../utils/config");
const { verifyToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return responseUtil.unauthorized(
        res,
        responseMessage.error.tokenEmpty,
        null
      );
    }

    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    req.decoded = await verifyToken(token);

    logger.info("token verified", req.decoded);
    // res.json({message:result});

    next();
  } catch (err) {
    logger.error(err);
    responseUtil.internalServerError(
      res,
      responseMessage.error.invalidToken,
      err
    );
  }
};

module.exports = { authMiddleware };
