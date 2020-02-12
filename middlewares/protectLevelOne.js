module.exports = function protectLevelOne(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "administrator" ||req.session.currentUser.role === "plants-administrator" || req.session.currentUser.role === "professor" || req.session.currentUser.role === "student" || req.session.currentUser.role === "moderator" || req.session.currentUser.role === "standard")) next();
    else res.redirect("/auth/signin");
}