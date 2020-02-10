const express = require("express");
const router = new express.Router();
const protectRoute = require("../middlewares/protectRoute");
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");
const publicationModel = require("../models/Publication");

router.get("/", (req, res, next) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css"] ,
        js: ["global.js"] ,
    };   
    Promise.all([ 
        publicationModel.find().populate("plant").limit(2), 
        plantModel.find().populate("family").limit(2),
        familyModel.find().limit(2),
        ])
    .then(dbResult => { 
        console.log(dbResult[0], dbResult[1], dbResult[2] )
        res.render("home", {
            publications : dbResult[0], plants : dbResult[1], families: dbResult[2] , data : data, 
      });  
    })
    .catch(next);
});    
    
router.get("/dashboard", protectRoute, (req, res) => {
  res.render("dashboard");
});

router.get("/admin", protectAdminRoute, (req, res) => {
  res.render("admin");
});

module.exports = router;
