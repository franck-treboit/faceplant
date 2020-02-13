const express = require("express");
const router = new express.Router();
const protectLevelZero = require("../middlewares/protectLevelZero");
const protectLevelTwo = require("../middlewares/protectLevelTwo");
const protectLevelOne = require("../middlewares/protectLevelOne");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");
const publicationModel = require("../models/Publication");

router.get("/", (req, res, next) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "create-family.css"] ,
        js: ["global.js"] ,
    };   
    Promise.all([ 
        publicationModel.find().populate("plant").limit(2), 
        plantModel.find().populate("family").limit(5),
        familyModel.find().limit(3),
        ])
    .then(dbResult => { 
        console.log(dbResult[0], dbResult[1], dbResult[2] )
        res.render("home", {
            publications : dbResult[0], plants : dbResult[1], families: dbResult[2] , data : data, 
      });  
    })
    .catch(next);
});    
    
router.get("/dashboard", protectLevelOne, (req, res) => {
  res.render("dashboard");
});

router.get("/admin", protectLevelTwo, (req, res) => {
  res.render("admin");
});

module.exports = router;
