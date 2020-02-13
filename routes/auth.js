const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt"); // intro to bcrypt hashing algorithm https://www.youtube.com/watch?v=O6cmuiTBZVs
const uploader = require("./../config/cloudinary");

router.get("/signup", (req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});



// router.post("/signup", uploader.single("avatar"), (req, res, next) => {
router.post("/signup", (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)

  if (!user.email || !user.password) {
    req.flash( "error", "do it again /auth/signup");
    res.redirect("/auth/signup");
    return;
  } else {
    userModel
      .findOne({ email: user.email })
      .then(dbRes => {
        if (dbRes) { 
            req.flash( "error", "do it again /auth/signup");
            return res.redirect("/auth/signup"); //
        }    

        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db
        user.creationLogin = Date.now();
        user.lastLogin = Date.now();
        userModel
          .create(user)
          .then(() => res.redirect("/auth/signin"))
          .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

router.post("/signin", (req, res, next) => {
  const user = req.body; 
  if (!user.email || !user.password) {
    req.flash("error", "wrong credentials");
    return res.redirect("/auth/signin");
  }
  userModel 
    .findOne({ email: user.email })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this email
        req.flash("error", "wrong credentials");
        return res.redirect("/auth/signin");
      }
        
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user        
        delete clone.password; // remove password from clone
        req.session.currentUser = clone; // user is now in session... until session.destroy
        return res.redirect("/dashboard");
      } else { 
        // encrypted password match failed
        return res.redirect("/auth/signin");
      }
    })
    .catch(next);
});

// action::Logout

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.locals.isAdmin = undefined;
    res.redirect("/auth/signin");
  });
});


router.get("/list-all", (HTTPRequest , HTTPResponse, next ) => {
    const data = {
        montitle : "Faceplant - home",
        css: ["global.css", "display-one.css"] ,
        js: ["global.js", "display-one.js"] ,
    };   
    Promise.all([ userModel.find()])
    .then(dbResult => { 
        console.log(dbResult[0])
        HTTPResponse.render("auth/list", {
            users : dbResult[0] , data : data, 
      });  
    })
    .catch(next);
});



module.exports = router;
