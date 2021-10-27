const bcrypt = require("bcrypt");
saltRounds = 10;

const bcryptPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.log("Error ", err);
  }
};

//compare password using bcrypt
const comparePassword = async (password, inputPassword) => {
  try {
    return await bcrypt.compare(password, inputPassword);
  } catch (err) {
    console.log("Error ", err);
  }
};

module.exports = { bcryptPassword, comparePassword };
