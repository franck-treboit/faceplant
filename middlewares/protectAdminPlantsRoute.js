module.exports = function protectAdminPlantsRoute(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "adminPlants" || req.session.currentUser.role === "admin")) next();
    else res.redirect("/auth/signin");
}