const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const familyModel = require("../models/Family");
const plantModel = require("../models/Plant");
const publicationModel = require("../models/Publication");
const uploader = require("./../config/cloudinary");


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


router.get("/list-all", (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ publicationModel.find().populate("plant")])
    .then(dbResult => { 
        console.log(dbResult[0])
        HTTPResponse.render("publication/list", {
            publications : dbResult[0] , data : data, 
      });  
    })
    .catch(next);
});

router.get("/display-one/:id", (req, res, next) => {
    const data = {
        montitle : "Facepublication - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ publicationModel.findById(req.params.id) , publicationModel.find().populate("plant")])
    .then(dbResult => { 
      res.render("publication/page-publication", {
        publication : dbResult[0], publications: dbResult[1], data : data, 
      });  
    })
    .catch(next);
});


router.get("/display-all-publication-one-plant/:id", (req, res, next) => {
    const data = {
        montitle : "Facepublication d'une seule plante - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ publicationModel.find( { plant : req.params.id} ).populate("plant") ])
    .then(dbResult => { 
      res.render("publication/list", {
        publications : dbResult[0], data : data, 
      });  
    })
    .catch(next);
});



router.get("/create-publication",  (req, res, next) => {
    Promise.all([ publicationModel.find().populate("plant") , plantModel.find()])
    .then(dbResults => {
      res.render("publication/create-publication", {
        publications: dbResults[0],
        plants: dbResults[1],
      });
    })
    .catch(next);
});

router.post("/create-publication", uploader.single("firstImage"), (req, res, next) => {    
  const newPublication = req.body;
  if (req.file) newPublication.firstImage = req.file.secure_url;  
  publicationModel
    .create(newPublication)
    .then(dbRes => {
      req.flash("success", "La publication s'est bien créé");
      res.redirect("/publication/create-publication");
    })
    .catch(next);
});



router.get("/update/:id", (req, res, next) => {
  Promise.all([ publicationModel.findById(req.params.id).populate("plant") , plantModel.find()])  
    .then(dbRes => {
      res.render("publication/update-publication", {
        publication: dbRes[0], plants: dbRes[1]
      });
    })
    .catch(next);
});

router.post("/update/:id", (req, res, next) => {
  const {  actif,  creationDate, lastModificationDate,  title,  description,  plant } = req.body;
  publicationModel
    .findByIdAndUpdate(req.params.id, {
        actif,  creationDate, lastModificationDate,  title,  description,  plant
    })
    .then(() => {
      req.flash("success", "publication successfully updated");
      res.redirect("/publication/list-all")
    })
    .catch(next);
});


