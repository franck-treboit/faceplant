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



router.get("/list-all", (req, res, next ) => {
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

router.get("/display-one/:id", (HTTPRequest , HTTPResponse, next ) => {
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

router.get("/update/:id", (req, res, next) => {
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

router.post("/update/:id", (req, res, next) => {
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