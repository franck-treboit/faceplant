const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: {
    type: String,
<<<<<<< HEAD
    enum: ["administrator", "standard", "plants-administrator", "professor", "student", "moderator", "user"],
=======
    enum: ["administrator", "standard", "plantsadministrator", "professor", "student", "moderator", "user"],
>>>>>>> 3dbd8b09e43db6e121fa1cf755a6cfe007648201
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
