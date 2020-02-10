/*
 * 
private $actif;
private $idAuteur;
private $idPlante;
private $imagelistId;
private $titre;
private $description;
private $firstImage;
private $icone;
private $lastModification;
private $dateCreation;
private $commentaireAuteur;
private $idResponsable;
private $note;
private $publicite;
private $idPublicationMere;
private $niveauProfondeurPublication;
 */

const mongoose = require("mongoose"); // import mongoose dependencie

const Schema = mongoose.Schema;

//type: [Schema.Types.ObjectId], can be an array

const publicationSchema = new Schema({
  actif: Boolean,
  creationDate: Date,
  lastModificationDate: Date,
  title: String,
  description: String,
  plant: {
    type: Schema.Types.ObjectId,
    ref: "Plant",
  },
});

const publicationModel = mongoose.model("Publication", publicationSchema);

module.exports = publicationModel;