const express = require("express");
const router = new express.Router();
const protectLevelOne = require("../middlewares/protectLevelONE");
const protectLevelTwo = require("../middlewares/ProtectLevelTwo");
const protectLevelZero = require("../middlewares/protectLevelZero");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");
const uploader = require("./../config/cloudinary");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITH "/styles"
// *********************************************


module.exports = router;

router.get("/list-all", protectLevelOne , (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "list-all.css"],
        js: ["global.js", "list-all.js"],
    };   
    Promise.all([ plantModel.find().populate("family")])
    .then(dbResult => { 
        console.log(dbResult[0])
        HTTPResponse.render("plant/list", {
            plants : dbResult[0] , data : data, 
      });  
    })
    .catch(next);
});



router.get("/display-one/:id", protectLevelOne, (req, res, next) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ plantModel.findById(req.params.id) , plantModel.find().populate("family")])
    .then(dbResult => { 
        console.log(dbResult[1])
      res.render("plant/page-plant", {
        plante : dbResult[0], family: dbResult[1], data : data, 
      });  
    })
    .catch(next);
});

router.get("/create-plant", protectLevelTwo, (req, res, next) => {
  const data = {
    css: ["global.css", "create-plant.css"],
    js: ["global.js", "create-plant.js"],
  };
    Promise.all([ plantModel.find().populate("family") , familyModel.find()])
    .then(dbResults => {
      res.render("plant/create-plant", {
        plants: dbResults[0], families: dbResults[1], data: data,
      });
    })
    .catch(next);
});

router.post("/create-plant", uploader.single("firstImage"), protectLevelTwo, (req, res, next) => {    
  const newPlant = req.body;
  newPlant.creationDate = Date.now(); 
  newPlant.lastModificationDate = Date.now(); 
  if (req.file) newPlant.firstImage = req.file.secure_url;
  plantModel
    .create(newPlant)
    .then(dbRes => {
      req.flash("success", "La plante s'est bien créée");
      res.redirect("/plant/create-plant");
    })
    .catch(next);
});

router.get("/update/:id", protectLevelTwo, (req, res, next) => {
  Promise.all([ plantModel.findById(req.params.id).populate("family") , familyModel.find()])  
    .then(dbRes => {
      res.render("plant/update-plant", {
        plant: dbRes[0], families: dbRes[1]
      });
    })
    .catch(next);
});

router.post("/update/:id", protectLevelTwo, (req, res, next) => {
  console.log(req.params);  
  const newPlant = req.body;
  newPlant.creationDate = Date.now(); 
  newPlant.lastModificationDate = Date.now();
  if (req.file) newPlant.firstImage = req.file.secure_url;
  plantModel
    .findByIdAndUpdate(req.params.id, newPlant)
    .then(() => {
      req.flash("success", "plant successfully updated");
      res.redirect("/plant/list-all")
    })
    .catch(next);
});
