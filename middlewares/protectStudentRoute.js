module.exports = function protectStudentRoute(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "student" || req.session.currentUser.role === "admin")) next();
    else res.redirect("/auth/signin");
}