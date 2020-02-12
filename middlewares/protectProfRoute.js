module.exports = function protectProfRoute(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "prof" || req.session.currentUser.role === "admin")) next();
    else res.redirect("/auth/signin");
}