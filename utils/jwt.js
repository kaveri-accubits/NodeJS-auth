const jwt = require("jsonwebtoken");
const { JWT } = require("../utils/config");

const jwtFunctions = async (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
    },
    JWT.SECRET_KEY
  );
  return token;
};

module.exports = { jwtFunctions };
