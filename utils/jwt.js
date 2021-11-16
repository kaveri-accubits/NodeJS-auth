const jwt = require("jsonwebtoken");
const { JWT } = require("../utils/config");

//function to generate token
const generateToken = (user, type = "access") => {
  const expiry =
    type === "refresh"
      ? JWT.REFRESH_TOKEN.REFRESH_EXPIRY
      : JWT.ACCESS_TOKEN.ACCESS_EXPIRY;

  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
    },
    type === "refresh"
      ? JWT.REFRESH_TOKEN.REFRESH_SECRET_KEY
      : JWT.ACCESS_TOKEN.ACCESS_SECRET_KEY,
    {
      expiresIn: expiry,
    }
  );
  return token;
};

const verifyToken = (token, type = "access") =>
  new Promise((resolve, reject) => {
    {
      const secretKey =
        type === "refresh"
          ? JWT.REFRESH_TOKEN.REFRESH_SECRET_KEY
          : JWT.ACCESS_TOKEN.ACCESS_SECRET_KEY;

      jwt.verify(token, secretKey, (err, result) => {
        logger.info("res", result);
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }
  });

module.exports = { generateToken, verifyToken };
