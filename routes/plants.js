const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITh "/styles"
// *********************************************

router.get("/admin", (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

module.exports = router;

router.get("/list-all", (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
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


router.get("/display-one/:id", (req, res, next) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ plantModel.findById(req.params.id) , plantModel.find().populate("family")])
    .then(dbResult => { 
        console.log(dbResult[1])
      res.render("plant/page-plant", {
        plante : dbResult[0], plants: dbResult[1], data : data, 
      });  
    })
    .catch(next);
});


router.get("/create-plant",  (req, res, next) => {
    Promise.all([ plantModel.find().populate("family") , familyModel.find()])
    .then(dbResults => {
      res.render("plant/create-plant", {
        plants: dbResults[0],
        families: dbResults[1],
      });
    })
    .catch(next);
});

router.post("/create-plant",  (req, res, next) => {    
  const newPlant = req.body;
  plantModel
    .create(newPlant)
    .then(dbRes => {
      req.flash("success", "La plante s'est bien créé");
      res.redirect("/plant/create-plant");
    })
    .catch(next);
});