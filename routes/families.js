const express = require("express");
const router = new express.Router();
const protectLevelOne = require("../middlewares/protectLevelOne");
const protectLevelTwo = require("../middlewares/protectLevelTwo");
const protectLevelZero = require("../middlewares/protectLevelZero");
const familyModel = require("../models/Family");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITH "/styles"
// *********************************************

router.get( protectLevelZero, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get( protectLevelOne, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get( protectLevelTwo, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/list-all", protectLevelOne, (req, res, next ) => {
   const data = {
        montitle : "Faceplant Plants - home",
     css: ["global.css", "list-all.css"] ,
     js: ["global.js", "list-all.js"] ,
    };
    Promise.all([familyModel.find()])
    .then(dbResults => {
      res.render("family/list", {
        families: dbResults[0], data: data
      });
    })
    .catch(next);    
});

router.get("/display-one/:id", protectLevelOne, (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"],
        js: ["global.js", "display-one.js"],
    };   
    Promise.all([ familyModel.findById(HTTPRequest.params.id)])
    .then(dbResult => { 
      HTTPResponse.render("family/page-family", {
        family : dbResult[0], data : data, 
      });  
    })
    .catch(next);
});
router.get("/create-family", protectLevelTwo, (req, res, next) => {
  const data = {
    css: ["global.css", "create-family.css"],
    js: ["global.js", "create-family.js"],
  };
    Promise.all([familyModel.find()])
    .then(dbResults => {
      res.render("family/create-family", {
        families: dbResults[0], data: data,
      });
    })
    .catch(next);
});

router.post("/create-family", protectLevelTwo, (req, res, next) => {    
  const {
    label
  } = req.body;
  familyModel
    .create({
      label,
    })
    .then(dbRes => {
      req.flash("success", "La famille s'est bien créée");
      res.redirect("/family/create-family");
    })
    .catch(next);
});

router.get("/update/:id",  protectLevelTwo, (req, res, next) => {
  Promise.all([
    familyModel.findById(req.params.id)
  ])
    .then(dbRes => {
      res.render("family/update-family", {
        family: dbRes[0],
      });
    })
    .catch(next);
});

router.post("/update/:id",protectLevelTwo, (req, res, next) => {
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