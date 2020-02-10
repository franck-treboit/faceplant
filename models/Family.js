const mongoose = require("mongoose"); // import mongoose dependencie
const Schema = mongoose.Schema;

const familySchema = new Schema({
  label: String,
});

const familyModel = mongoose.model("Family", familySchema);
module.exports = familyModel;

