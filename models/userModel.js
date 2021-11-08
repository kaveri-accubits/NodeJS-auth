const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { USER } = require("../utils/config");

//user schema
const UserAuthSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },

  userType: {
    type: Number,
    default: USER.TYPE.user,
  },

  isTempPassword: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("User", UserAuthSchema);
