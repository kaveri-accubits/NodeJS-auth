const { body, validationResult } = require("express-validator");
const {
  UserRegControl,
  UserLoginControl,
} = require("../controllers/userController");

/**
 *Checks For Errors in the Body Fields
 *
 *if Error   -> Send Status Code 400
 *   Success -> Adds to Database
 *
 */
function UserRegValidator(req, res) {
  //console.log("Body", req.body);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  //console.log("Errors", errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    UserRegControl(req, res);
  }

  return errors;
}
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

//login part
const UserLoginValidator = async (req, res) => {
  const errors = validationResult(req);
  console.log("error detected", errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    UserLoginControl(req, res);
  }

  return errors;
};

//validation for login
const UserLoginValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
  body("password").isLength({ min: 5 }),
];

//validation for forgot password
const ForgotPasswordValidationRules = [
  body("email").isEmail().isLength({ min: 7 }).withMessage("Email is required"),
];

module.exports = {
  UserRegValidator,
  UserLoginValidator,
  UserRegValidationRules,
  UserLoginValidationRules,
  ForgotPasswordValidationRules,
};
