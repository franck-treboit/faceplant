const express = require("express");0
const router = new express.Router();
const protectLevelOne = require("../middlewares/protectLevelOne");
const familyModel = require("../models/Family");
const protectLevelTwo = require("../middlewares/ProtectLevelTwo");
const protectLevelZero = require("../middlewares/protectLevelZero");
const plantModel = require("../models/Plant");
const publicationModel = require("../models/Publication");
const userModel = require("../models/User");
const uploader = require("./../config/cloudinary");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITH "/styles"
// *********************************************

router.get("/admin", protectLevelZero, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/user", protectLevelOne, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

router.get("/prof", protectLevelTwo, (req, res) => {
  res.render("tables/styles", {
    js: ["manage-styles"],
    needAJAX: true
  });
});

module.exports = router;

router.get("/list-all", protectLevelZero,(HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "list-all.css"],
        js: ["global.js", "list-all.js"],
    };   
    Promise.all([ publicationModel.find().populate("plant").populate("writer")])
    .then(dbResult => { 
        console.log(dbResult[0])
        HTTPResponse.render("publication/list", {
            publications : dbResult[0] , data : data, 
      });  
    })
    .catch(next);
});

router.get("/display-one/:id", protectLevelZero, (req, res, next) => {
    const data = {
        montitle : "Facepublication - home",
        css: ["global.css", "display-one.css"],
        js: ["global.js", "display-one.js"],
    };   
    Promise.all([ publicationModel.findById(req.params.id) , publicationModel.find().populate("plant").populate("writer")])
    .then(dbResult => { 
      res.render("publication/page-publication", {
        publication : dbResult[0], publications: dbResult[1], data : data, 
      });  
    })
    .catch(next);
});

router.get("/display-all-publication-one-plant/:id", protectLevelZero, (req, res, next) => {
    const data = {
        montitle : "Facepublication d'une seule plante - home",
        css: ["global.css", "display-all-publication-one-plant.css"] ,
        js: ["global.js", "display-all-publication-one-plant.js"] ,
    };   
    Promise.all([ publicationModel.find( { plant : req.params.id} ).populate("plant").populate("writer") ])
    .then(dbResult => { 
      res.render("publication/list", {
        publications : dbResult[0], data : data, 
      });  
    })
    .catch(next);
});

router.get("/display-all-publication-one-writer/:id", protectLevelZero, (req, res, next) => {
    const data = {
        montitle : "Facepublication d'une seul auteur - home",
        css: ["global.css", "create-publication.css"],
          js: ["global.js", "create-publication.js"],
    };   
    Promise.all([ publicationModel.find( { writer : req.params.id} ).populate("plant").populate("writer") ])
    .then(dbResult => { 
      res.render("publication/list", {
        publications : dbResult[0], data : data, 
      });  
    })
    .catch(next);
});



router.get("/create-publication", protectLevelTwo, (req, res, next) => {
    const data = {
        montitle : "Facepublication d'une seule plante - home",
        css: ["global.css", "create-publication.css"] ,
        js: ["global.js", "create-publication.js"] ,
    };  
    Promise.all([ publicationModel.find().populate("plant") , plantModel.find()])
    .then(dbResults => {
      res.render("publication/create-publication", {
        publications: dbResults[0],
        plants: dbResults[1], data : data,
      });
    })
    .catch(next);
});

router.post("/create-publication", uploader.single("firstImage"), protectLevelTwo, (req, res, next) => {    
  const newPublication = req.body;
  newPublication.creationDate = Date.now(); 
  newPublication.lastModificationDate = Date.now(); 
  newPublication.writer = req.session.currentUser._id ; 
  if (req.file) newPublication.firstImage = req.file.secure_url;  
  publicationModel
    .create(newPublication)
    .then(dbRes => {
      req.flash("success", "La publication s'est bien créée");
      res.redirect("/publication/create-publication");
    })
    .catch(next);
});

router.get("/update/:id", protectLevelTwo, (req, res, next) => {
const data = {
  css: ["global.css", "update-publication.css"],
  js: ["global.js", "update-publication.js"],
};
  Promise.all([ publicationModel.findById(req.params.id).populate("plant") , plantModel.find()])  
    .then(dbRes => {
      res.render("publication/update-publication", {
        publication: dbRes[0], plants: dbRes[1], data: data,
      });
    })
    .catch(next);
});


router.post("/update/:id", protectLevelTwo, (req, res, next) => {
  const newPublication = req.body;
  newPublication.lastModificationDate = Date.now();
  if (req.file) newPublication.firstImage = req.file.secure_url;
  publicationModel
    .findByIdAndUpdate(req.params.id, 
        newPublication 
    )
    .then(() => {
      req.flash("success", "publication successfully updated");
      res.redirect("/publication/list-all")
    })
    .catch(next);
});


router.post("/ajax-create-publication", uploader.single("firstImage"), (req, res, next) => {

    console.log(req.query.plant);
    plantModel.findById(req.query.plant)  
    .then(dbRes => { 
        const plantLocal = dbRes
        const newPublication = {};
        newPublication.title = req.query.title;
        newPublication.description = req.query.description;
        newPublication.plant = req.query.plant;
        newPublication.creationDate = Date.now(); 
        newPublication.lastModificationDate = Date.now(); 
        newPublication.writer = req.session.currentUser._id ; 
        newPublication.firstImage = "https://res.cloudinary.com/franck-treboit/image/upload/v1581603199/user-pictures/hhx2wrqytalracluptrl.jpg";
        if (req.file) newPublication.firstImage = req.file.secure_url;        
        publicationModel
        .create(newPublication)
        .then(dbResults => {
          res.send(
            { "newpub" : newPublication , "email" : req.session.currentUser.email, "plant": plantLocal.cultivar+" "+plantLocal.vernaculaire+" "+plantLocal.autreNom }
          );
        })
        .catch(next);
    })
    .catch(next);
});