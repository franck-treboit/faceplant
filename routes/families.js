const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
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

module.exports = router;

router.get("/list-all", (HTTPRequest , HTTPResponse ) => {
   const data = {
        montitle : "Faceplant Plants - home",
        css: ["global.css", "display-all.css"] ,
        js: ["global.js", "display-all.js"] ,
    };
   HTTPResponse.render("family/list", data); //data must be an object
});

router.get("/display-one", (HTTPRequest , HTTPResponse ) => {
   const data = {
        montitle : "Faceplant Plants - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
   HTTPResponse.render("family/one", data); //data must be an object
});

router.get("/create-family",  (req, res, next) => {
    Promise.all([familyModel.find()])
    .then(dbResults => {
      res.render("family/create-family", {
        families: dbResults[0],
      });
    })
    .catch(next);
});

router.post("/create-family",  (req, res, next) => {    
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

module.exports = router;