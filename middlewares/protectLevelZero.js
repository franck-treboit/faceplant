<<<<<<< HEAD:middlewares/protectLevelZero.js
module.exports = function protectLevelZero(req, res, next) {
    if (req.session.currentUser) next();
=======
module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === "standard") next();
>>>>>>> 3dbd8b09e43db6e121fa1cf755a6cfe007648201:middlewares/protectRoute.js
    else res.redirect("/auth/signin");
}