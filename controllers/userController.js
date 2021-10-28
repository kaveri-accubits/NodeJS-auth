const User = require("../models/userModel");
const { bcryptPassword, comparePassword } = require("../utils/bcrypt");
//const config = require("../utils/config");
const { HTTP_STATUS_CODES, JWT } = require("../utils/config");
const { jwtFunctions } = require("../utils/jwt");
const { sendMail } = require("../utils/mail");
saltRounds = 10;

async function UserRegControl(req, res) {
  try {
    const { username, email, password, dob, contactNumber } = req.body;
    const hashedPassword = await bcryptPassword(password);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      dob: dob,
      contactNumber: contactNumber,
    });
    //console.log(newUser);
    newUser
      .save()
      .then(async (result) => {
        console.log("Result: ", result);
        var mailParams = {
          to: email,
          subject: "Registration Successful",
          text: "Welcome!",
        };
        await sendMail(mailParams);
        res.status(HTTP_STATUS_CODES.CREATED).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Error registering user",
      error,
    });
  }
}

//Login part
function UserLoginControl(req, res) {
  try {
    const { email, password } = req.body;
    User.findOne({ email: email })
      .then((user) => {
        console.log("User", user);
        const inputPassword = user.password;
        if (user) {
          console.log("user detected");
          comparePassword(password, inputPassword).then((result) => {
            if (result) {
              let token = jwtFunctions(user);
              res.status(200).json({
                success: true,
                message: "User logged in",
                token: token,
              });
            } else {
              //forgotPassword(req, res);
              res.status(401).json({
                message: "Password incorrect",
                success: false,
              });
            }
          });
          if (isTempPassword) {
            sendResetPasswordLink(req, res);
            res.status(200).json({
              message: "You will be redirected to reset the password",
            });
          }
        } else {
          res.status(400).json({
            message: "user not found",
          });
        }
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Error logging in user",
      error,
    });
  }
}

//Function to get all users
const getUserDetails = async (req, res) => {
  try {
    console.log("req ", req.decoded);
    let userId = req.decoded.userId;
    let user = await User.findById(userId);

    res.status(200).json(user);
    console.log("result");
  } catch (err) {
    res.status(500).json(err);
  }
};

//Function to update user details
const updateUserDetails = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let user = await User.findById(userId);
    if (user) {
      user.username = req.body.username;
      user.email = req.body.email;
      user.dob = req.body.dob;
      user.contactNumber = req.body.contactNumber;
      if (req.body.password) {
        user.password = await bcryptPassword(req.body.password);
      }
      user.save();
      res.status(200).json(user);
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//function for forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let newPassword = Math.random().toString(36).slice(-5);
      console.log("newPassword", newPassword);
      let hashedPassword = await bcryptPassword(newPassword);
      user.password = hashedPassword;
      user.save();
      let mailParams = {
        to: user.email,
        subject: "Password Reset",
        text: "Your new password is " + newPassword,
      };
      await sendMail(mailParams);
      res.status(200).json({
        message: "Password reset",
      });
      isTempPassword = true;
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//function to send reset password link after login
const sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let token = jwtFunctions(user);
      let mailParams = {
        to: user.email,
        subject: "Reset Password",
        text: "Click on the link to reset your password",
        link: "http://localhost:3000/resetPassword/" + token,
      };
      await sendMail(mailParams);
      res.status(200).json({
        message: "Reset password link sent",
      });
      isTempPassword = false;
      // setTimeout(() => {
      //   res.status(200).json({
      //     message: "Reset password link expired",
      //   });
      // }, 300000);
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  UserRegControl,
  UserLoginControl,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  sendResetPasswordLink,
};
