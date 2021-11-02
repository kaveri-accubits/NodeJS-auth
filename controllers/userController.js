const User = require("../models/userModel");
const multer = require("multer");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const { bcryptPassword, comparePassword } = require("../utils/bcrypt");
//const config = require("../utils/config");
const { HTTP_STATUS_CODES, JWT } = require("../utils/config");
const { user } = require("../utils/responseMessage");
const { generateToken } = require("../utils/jwt");
const { sendMail } = require("../utils/mail");
const { upload } = require("../utils/multer");
saltRounds = 10;

//create a function and and make if conditions for true and false
const isTempPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return true;
  } else {
    return false;
  }
};

/* ---------------------------------------------REGISTRATION --------------------------------------------------------------------*/
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
        return responseUtil.success(
          res,
          responseMessage.user.registered,
          result
        );
      })
      .catch((err) => {
        console.log("Error", err);
        return responseUtil.internalServerError(
          res,
          responseMessage.error.errorRegistering,
          err
        );
      });
  } catch (error) {
    console.log("error", error);
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorRegistering,
      error
    );
  }
}

/* ---------------------------------------------LOGIN --------------------------------------------------------------------*/
async function UserLoginControl(req, res) {
  try {
    const { email, password } = req.body;
    console.log("body", req.body);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return responseUtil.notFound(
        res,
        responseMessage.user.userNotFound,
        null
      );
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return responseUtil.unauthorized(
        res,
        responseMessage.error.invalidPassword,
        null
      );
    }

    const token = await generateToken(user);
    return responseUtil.success(res, responseMessage.user.loggedIn, token);
  } catch (error) {
    console.log("error", error);
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorLoggingIn,
      error
    );
  }
}

/* ---------------------------------------------GET USERS --------------------------------------------------------------------*/
const getUserDetails = async (req, res) => {
  try {
    console.log("req ", req.decoded);
    let userId = req.decoded.userId;
    let user = await User.findById(userId);

    return responseUtil.success(res, responseMessage.user.userFound, result);
  } catch (err) {
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorGettingUser,
      err
    );
  }
};

/* ---------------------------------------------UPDATE USER DETAILS --------------------------------------------------------------------*/
const updateUserDetails = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    //console.log("userId", userId);
    let userData = await User.findById(userId);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads"); // path from our current file to storage location
      },
      filename: (req, file, cb) => {
        console.log("filename", file);
        cb(null, Date.now() + "--" + file.originalname);
      },
    });
    var uploadImage = multer({ storage: storage }).single("profileImage");
    //const uploadImage = upload.single("profileImage");

    uploadImage(req, res, async (err) => {
      if (err) {
        console.log("err", err);
        return responseUtil.internalServerError(
          res,
          responseMessage.error.errorUploading,
          err
        );
      }

      let updateDetails = {
        username: req.body.username,
        email: req.body.email,
        dob: req.body.dob,
        contactNumber: req.body.contactNumber,
      };

      if (req.file) {
        userData.profileImage = req.file.filename;
        console.log("req.file", req.file);
      }
      if (userData) {
        await User.updateOne(
          { _id: userId },
          {
            $set: updateDetails,
          }
        );
        return responseUtil.success(
          res,
          responseMessage.user.userUpdated,
          userData
        );
      } else {
        return responseUtil.badRequest(
          res,
          responseMessage.user.userNotFound,
          null
        );
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ---------------------------------------------FORGOT PASSWORD --------------------------------------------------------------------*/
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
      return responseUtil.success(res, responseMessage.user.tempPassword, null);

      //let isTempPassword = true;
    } else {
      return responseUtil.badRequest(
        res,
        responseMessage.user.userNotFound,
        null
      );
    }
  } catch (err) {
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorGettingUser,
      err
    );
    // res.status(500).json(err);
  }
};

/* ---------------------------------------------UPDATE PASSWORD  --------------------------------------------------------------------*/
const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      if (password === confirmPassword) {
        user.password = await bcryptPassword(password);
        user.save();
        //isTempPassword = false;
        return responseUtil.success(
          res,
          responseMessage.user.passwordReset,
          null
        );
      } else {
        return responseUtil.badRequest(
          res,
          responseMessage.error.passwordNotMatch,
          null
        );
      }
    } else {
      return responseUtil.badRequest(
        res,
        responseMessage.user.userNotFound,
        null
      );
    }
  } catch (err) {
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorResettingPassword,
      err
    );
  }
};

module.exports = {
  UserRegControl,
  UserLoginControl,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  resetPassword,
};
