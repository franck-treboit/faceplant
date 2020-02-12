require("dotenv").config();
require("./config/dbconnect");
require("./helpers/hbs"); // custom functions adding features to hbs templates

const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// INITAL CONFIG
app.use(express.urlencoded({ extended: true })); // parse posted data
app.use(express.json()); // ajax ready

app.use(express.static(path.join(__dirname, "public"))); // static files (public for browsers)
app.set("views", path.join(__dirname, "views")); // wahre are the pages ?
app.set("view engine", "hbs"); // which template engine
hbs.registerPartials(path.join(__dirname, "views/partials")); // where are the tiny chunks of views ?

// INITIALIZE SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
    // req.session.cookie.expires = new Date(Date.now() + hour)
    // req.session.cookie.maxAge = hour
  })
);

// FLASH MESSAGES
// enable "flash messaging" system
// it depends on the express-session mechanism
app.use(flash());

// CUSTOM MIDDLEWARES

// expose flash message to the hbs templates, if any flash-message is defined
app.use(require("./middlewares/exposeFlashMessage"));

// expose login status to the hbs templates
app.use(require("./middlewares/exposeLoginStatus"));


// ROUTING
app.use("/", require("./routes"));
app.use("/auth", require("./routes/auth"));


app.use("/family", require("./routes/families"));
app.use("/plant", require("./routes/plants"));
app.use("/publication", require("./routes/publications"));


app.listen(9999, () => {
  console.log('My website on port 9999')
});

// export the app (check import ./bin/www)
module.exports = app;
