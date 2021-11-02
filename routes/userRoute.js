const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth");
const multer = require("multer");
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
  ResetPasswordValidationRules,
  ResetPasswordValidator,
} = require("../middleware/userValidator");

const { upload } = require("../utils/multer");

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

//upload profile picture
router.post("/upload", upload.single("profileImage"), (req, res) => {
  res.send(req.file);
  console.log("success", req.file);
});

//reset password
router.put(
  "/reset/password",
  ResetPasswordValidationRules,
  ResetPasswordValidator
);

module.exports = router;
