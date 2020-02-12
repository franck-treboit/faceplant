const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const protectStudentRoute = require("../middlewares/protectStudentRoute");
const protectModeratorRoute = require("../middlewares/protectModeratorRoute");
const protectAdminPlantsRoute = require("../middlewares/protectAdminPlantsRoute");
const protectProfRoute = require("../middlewares/protectProfRoute");
const protectRoute = require("../middlewares/protectRoute");
const familyModel = require("../models/Family");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITh "/styles"
// *********************************************

router.get("/admin", protectAdminRoute, (req, res) => {
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


router.get("/list-all", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute || protectRoute, (req, res, next ) => {
   const data = {
        montitle : "Faceplant Plants - home",
        css: ["global.css", "display-all.css"] ,
        js: ["global.js", "display-all.js"] ,
    };
    Promise.all([familyModel.find()])
    .then(dbResults => {
      res.render("family/list", {
        families: dbResults[0], data: data
      });
    })
    .catch(next);    
});

router.get("/display-one/:id", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute || protectRoute, (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ familyModel.findById(HTTPRequest.params.id)])
    .then(dbResult => { 
      HTTPResponse.render("family/page-family", {
        family : dbResult[0], data : data, 
      });  
    })
    .catch(next);
});

router.get("/create-family", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
    Promise.all([familyModel.find()])
    .then(dbResults => {
      res.render("family/create-family", {
        families: dbResults[0],
      });
    })
    .catch(next);
});

router.post("/create-family", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {    
  const {
    label
  } = req.body;
  familyModel
    .create({
      label,
    })
    .then(dbRes => {
      req.flash("success", "La famille s'est bien créé");
      res.redirect("/family/create-family");
    })
    .catch(next);
});

router.get("/update/:id",  protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
  Promise.all([
    familyModel.findById(req.params.id).populate("artist")
  ])
    .then(dbRes => {
      res.render("family/update-family", {
        family: dbRes[0],
      });
    })
    .catch(next);
});

router.post("/update/:id", protectAdminPlantsRoute || protectAdminRoute || protectModeratorRoute || protectStudentRoute || protectProfRoute, (req, res, next) => {
  const { label } = req.body;
  familyModel
    .findByIdAndUpdate(req.params.id, {
      label
    })
    .then(() => {
      req.flash("success", "family successfully updated");
      res.redirect("/family/list-all")
    })
    .catch(next);
});

module.exports = router;