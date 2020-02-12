module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === "standard") next();
    else res.redirect("/auth/signin");
}