module.exports = function protectAdminRoute(req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === "administrator") next();
    else res.redirect("/auth/signin");
}