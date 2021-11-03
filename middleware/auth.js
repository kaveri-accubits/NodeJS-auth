const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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
      res.status(500).json("Invalid token!");
    }
  } else {
    result = {
      message: "No token is provided!",
    };
    res.status(401).send(result);
  }
};

module.exports = { validateToken };
