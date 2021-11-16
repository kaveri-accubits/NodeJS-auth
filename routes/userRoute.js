const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authentication");
const { validate } = require("../middleware/validator");
const {
  UserRegControl,
  UserLoginControl,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  getAllUsers,
  generateRefreshToken,
} = require("../controllers/userController");

const {
  UserRegValidationRules,
  UserLoginValidationRules,
  ForgotPasswordValidationRules,
  ResetPasswordValidationRules,
  listUsers,
} = require("../middleware/userValidator");

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../utils/dummyAPI");

const { upload } = require("../utils/multer");

//register

router.post("/register", validate(UserRegValidationRules), UserRegControl);

//login
router.post("/login", validate(UserLoginValidationRules), UserLoginControl);

//get user details after token validation
router.get("/view", authMiddleware, getUserDetails);

//update user details after token validation
router.put("/update", authMiddleware, updateUserDetails);

//forgot password
router.post("/forgot/password", ForgotPasswordValidationRules, forgotPassword);

//upload profile picture
router.post("/upload", upload.single("profileImage"), (req, res) => {
  res.send(req.file);
  logger.info("success", req.file);
});

//reset password
router.put(
  "/reset/password",
  validate(ResetPasswordValidationRules),
  resetPassword
);

//to get the list of all users
router.get("/list", authMiddleware, validate(listUsers), getAllUsers);

//to get refresh token
router.post("/refresh", generateRefreshToken);

/* USING DUMMY API */

router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.post("/employee", createEmployee);
router.put("/employee/:id", updateEmployee);
router.delete("/employee/:id", deleteEmployee);

module.exports = router;
