const { body, query, validationResult } = require("express-validator");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const { validate } = require("../middleware/validator");

//for registration
const UserRegValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password is required"),
  body("username").isLength({ min: 6 }),
  body("dob").isLength({ min: 8 }).withMessage("Date of Birth is required"),
  body("contactNumber")
    .isLength({ min: 10 })
    .isNumeric()
    .withMessage("Phone Number is required"),
];
/*----------------------------------------------------------------------------------------- */

//validation for login
const UserLoginValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
  body("password").isLength({ min: 5 }),
];

//validation for forgot password
const ForgotPasswordValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
];

//validation for update user details
const UpdateUserValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
  body("password").isLength({ min: 5 }),
  body("username").isLength({ min: 6 }),
  body("dob").isLength({ min: 8 }).withMessage("Date of Birth is required"),
  body("contactNumber")
    .isLength({ min: 10 })
    .isNumeric()
    .withMessage("Phone Number is required"),
];

const ResetPasswordValidationRules = [
  body("password").isLength({ min: 5 }).withMessage("Password is required"),
  body("confirmPassword")
    .isLength({ min: 5 })
    .withMessage("Password is required"),
];

const listUsers = [
  query("page")
    .optional()
    .isInt({ gt: 0, lt: 10 })
    .withMessage("Page is required")
    .bail(),
  query("size")
    .optional()
    .isInt({ gt: 1, lt: 100 })
    .withMessage("size is required"),
];

module.exports = {
  UserRegValidationRules,
  UserLoginValidationRules,
  ForgotPasswordValidationRules,
  ResetPasswordValidationRules,
  UpdateUserValidationRules,
  listUsers,
};
