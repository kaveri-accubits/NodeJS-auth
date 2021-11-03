const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth");
const { validate } = require("../middleware/validator");
const {
  UserRegControl,
  UserLoginControl,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  getAllUsers,
} = require("../controllers/userController");

const {
  UserRegValidationRules,
  UserLoginValidationRules,
  ForgotPasswordValidationRules,
  ResetPasswordValidationRules,
  listUsers,
} = require("../middleware/userValidator");

const { upload } = require("../utils/multer");

//register

router.post("/register", validate(UserRegValidationRules), UserRegControl);

//login
router.post("/login", validate(UserLoginValidationRules), UserLoginControl);

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
  validate(ResetPasswordValidationRules),
  resetPassword
);

//to get the list of all users except the logged in user
router.get("/list", validateToken, validate(listUsers), getAllUsers);

module.exports = router;
