const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth");
const {
  getUserDetails,
  updateUserDetails,
} = require("../controllers/userController");

const {
  UserRegValidator,
  UserLoginValidator,
  UserRegValidationRules,
  UserLoginValidationRules,
} = require("../middleware/userValidator");

//register

router.post("/register", UserRegValidationRules, UserRegValidator);

//login
router.post("/login", UserLoginValidationRules, UserLoginValidator);

//get user details after token validation
router.get("/view", validateToken, getUserDetails);

//update user details after token validation
router.put("/update", validateToken, updateUserDetails);

module.exports = router;
