const mongoose = require("mongoose"); // import mongoose dependencie

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  actif: Boolean,
  creationDate: Date,
  lastModificationDate: Date,
  cultivar: String,
  vernaculaire: String,
  autreNom: String,
  champLibrePourInformationsSupplementaires: String,
  firstImage: String,
  family: {
    type: Schema.Types.ObjectId,
    ref: "Family",
  },
});

const plantModel = mongoose.model("Plant", plantSchema);

module.exports = plantModel;
