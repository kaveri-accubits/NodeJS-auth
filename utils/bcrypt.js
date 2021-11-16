const bcrypt = require("bcrypt");
const logger = require("./logger");
saltRounds = 10;

const bcryptPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    logger.error("Error " + error);
  }
};

//compare password using bcrypt
const comparePassword = async (password, inputPassword) => {
  try {
    return await bcrypt.compare(password, inputPassword);
  } catch (err) {
    logger.error("Error " + error);
  }
};

module.exports = { bcryptPassword, comparePassword };
