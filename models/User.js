const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  inscription: Date,
  lastConnection: Date,
  role: {
    type: String,
    enum: ["Administrator", "Standard", "Plants-Administrator", "Professor", "Student", "Moderator", "User"],
    default: "user"
  },
  avatar: {
    type: String,
    default: "https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png(19 ko)"

  } 
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
