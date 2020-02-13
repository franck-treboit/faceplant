const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["administrator", "standard", "plants-administrator", "professor", "student", "moderator", "user"],
    default: "user"
  },
  avatar: {
    type: String,
    default: "https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png(19 ko)",
  },
  lastLogin: Date,
  creationLogin: Date,  
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
