module.exports = function protectAdminPlantsRoute(req, res, next) {
    if (req.session.currentUser && (req.session.currentUser.role === "plantsadministrator" || req.session.currentUser.role === "standard" ||req.session.currentUser.role === "administrator")) next();
    else res.redirect("/auth/signin");
}