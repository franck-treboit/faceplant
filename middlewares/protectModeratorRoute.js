module.exports = function protectModeratorRoute(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "moderator" || req.session.currentUser.role === "admin")) next();
    else res.redirect("/auth/signin");
}