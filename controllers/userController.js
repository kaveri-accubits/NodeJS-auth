const multer = require("multer");
const redis = require("redis");

const User = require("../models/userModel");
const { verifyToken } = require("../utils/jwt");
const responseUtil = require("../utils/response");
const responseMessage = require("../utils/responseMessage");
const { user } = require("../utils/responseMessage");

const { bcryptPassword, comparePassword } = require("../utils/bcrypt");
const { HTTP_STATUS_CODES, JWT, REDIS } = require("../utils/config");
const { generateToken } = require("../utils/jwt");
const { sendMail } = require("../utils/mail");
const { upload } = require("../utils/multer");
const logger = require("../utils/logger");
const client = redis.createClient({
  host: REDIS.REDIS_HOST,
  port: REDIS.REDIS_PORT,
});
client.on("error", function (error) {
  logger.error("Error " + error);
});

saltRounds = 10;

//create a function and and make if conditions for true and false
// const isTempPassword = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (user) {
//     return true;
//   } else {
//     return false;
//   }
// };

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
    logger.info(newUser);
    newUser
      .save()
      .then(async (result) => {
        logger.info("Result: ", result);
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
        logger.error("Error " + error);
        return responseUtil.internalServerError(
          res,
          responseMessage.error.errorRegistering,
          err
        );
      });
  } catch (error) {
    logger.error("Error " + error);
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
    logger.info("body", req.body);
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
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, (type = "refresh"));
    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    //save refresh token in redis
    client.set(
      `${refreshToken}`,
      JSON.stringify({
        refreshToken: refreshToken,
        user_id: user._id,
      })
      //JWT.REFRESH_TOKEN.REFRESH_EXPIRY
    );

    return responseUtil.success(res, responseMessage.user.loggedIn, {
      user,
      tokens,
    });
  } catch (error) {
    logger.error("Error " + error);
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
    logger.info("req ", req.decoded);
    let userId = req.decoded.userId;
    let user = await User.findById(userId);
    logger.info("user", user);

    return responseUtil.success(res, responseMessage.user.userFound, user);
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
    logger.info("userId", userId);
    let userData = await User.findById(userId);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads"); // path from our current file to storage location
      },
      filename: (req, file, cb) => {
        logger.info("file", file);
        cb(null, Date.now() + "--" + file.originalname);
      },
    });
    var uploadImage = multer({ storage: storage }).single("profileImage");

    uploadImage(req, res, async (err) => {
      if (err) {
        logger.error("Error " + error);
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
        logger.info("req.file", req.file);
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
      logger.info("newPassword", newPassword);
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

/* ---------------------------------------------GET THE LIST OF USERS --------------------------------------------------------------------*/

const getAllUsers = async (req, res) => {
  try {
    let { page, size, search } = req.query;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 5;
    }
    if (!search) {
      search = "";
    }
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let userId = req.decoded.userId;
    logger.info("userId", userId);

    let users = await User.find({ _id: { $ne: userId } })
      .limit(limit)
      .skip(skip);

    let userList = users.map((user) => {
      return {
        username: user.username,
        email: user.email,
        dob: user.dob,
      };
    });
    return responseUtil.success(res, responseMessage.user.listShared, userList);
  } catch (err) {
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorGettingUser,
      err
    );
  }
};

/* Generate new access token and refresh token after expiry */

const generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    //user
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return responseUtil.badRequest(
        res,
        responseMessage.error.invalidToken,
        null
      );
    }

    const result = await verifyToken(refreshToken, "refresh");
    logger.info("res", result);

    await client.del(refreshToken);

    const newAccessToken = generateToken(user);
    const newRefreshToken = generateToken(user, (type = "refresh"));
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    client.set(
      `${newRefreshToken}`,
      JSON.stringify({
        refreshToken: newRefreshToken,
        user_id: user._id,
      })
      //JWT.REFRESH_TOKEN.REFRESH_EXPIRY
    );
    const data = {
      tokens,
    };
    return responseUtil.success(res, responseMessage.user.success, data);
  } catch (err) {
    return responseUtil.internalServerError(
      res,
      responseMessage.error.errorGettingUser,
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
  getAllUsers,
  generateRefreshToken,
};
