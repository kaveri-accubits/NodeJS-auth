const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  isTempPassword: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("User", UserAuthSchema);
