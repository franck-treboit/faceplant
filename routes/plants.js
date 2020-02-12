const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const protectStudentRoute = require("../middlewares/protectStudentRoute");
const protectModeratorRoute = require("../middlewares/protectModeratorRoute");
const protectAdminPlantsRoute = require("../middlewares/protectAdminPlantsRoute");
const protectProfRoute = require("../middlewares/protectProfRoute");
const protectRoute = require("../middlewares/protectRoute");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");


// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITh "/styles"
// *********************************************

router.get("/admin", protectAdminRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/prof", protectProfRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/student", protectStudentRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/moderator", protectModeratorRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/adminplants", protectAdminPlantsRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/user", protectRoute, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

module.exports = router;

router.get("/list-all", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute || protectRoute, (HTTPRequest , HTTPResponse, next ) => {
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


router.get("/display-one/:id", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute || protectRoute, (req, res, next) => {
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


router.get("/create-plant", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
    Promise.all([ plantModel.find().populate("family") , familyModel.find()])
    .then(dbResults => {
      res.render("plant/create-plant", {
        plants: dbResults[0],
        families: dbResults[1],
      });
    })
    .catch(next);
});

router.post("/create-plant", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {    
  const newPlant = req.body;
  plantModel
    .create(newPlant)
    .then(dbRes => {
      req.flash("success", "La plante s'est bien créé");
      res.redirect("/plant/create-plant");
    })
    .catch(next);
});

router.get("/update/:id", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
  Promise.all([ plantModel.findById(req.params.id).populate("family") , familyModel.find()])  
    .then(dbRes => {
      res.render("plant/update-plant", {
        plant: dbRes[0], families: dbRes[1]
      });
    })
    .catch(next);
});

router.post("/update/:id", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
  const { actif,  creationDate,  lastModificationDate,  cultivar,  vernaculaire,  autreNom,  champLibrePourInformationsSupplementaires,  family } = req.body;
  plantModel
    .findByIdAndUpdate(req.params.id, {
      actif,  creationDate,  lastModificationDate,  cultivar,  vernaculaire,  autreNom,  champLibrePourInformationsSupplementaires,  family
    })
    .then(() => {
      req.flash("success", "plant successfully updated");
      res.redirect("/plant/list-all")
    })
    .catch(next);
});
