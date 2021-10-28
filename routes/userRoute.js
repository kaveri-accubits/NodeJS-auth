const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth");
const {
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  sendResetPasswordLink,
} = require("../controllers/userController");

const {
  UserRegValidator,
  UserLoginValidator,
  UserRegValidationRules,
  UserLoginValidationRules,
  ForgotPasswordValidationRules,
} = require("../middleware/userValidator");

//register

router.post("/register", UserRegValidationRules, UserRegValidator);

//login
router.post("/login", UserLoginValidationRules, UserLoginValidator);

//get user details after token validation
router.get("/view", validateToken, getUserDetails);

//update user details after token validation
router.put("/update", validateToken, updateUserDetails);

//forgot password
router.post("/forgot/password", ForgotPasswordValidationRules, forgotPassword);

//send reset password link
router.post("/reset/password", sendResetPasswordLink);

module.exports = router;
