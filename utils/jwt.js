const jwt = require("jsonwebtoken");
const { JWT } = require("../utils/config");

//function to generate token
const generateToken = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
    },
    JWT.SECRET_KEY
  );
  return token;
};

module.exports = { generateToken };
