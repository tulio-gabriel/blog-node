
const eAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user.eAdmin == 1) {
		return next();
	}
	req.flash("error", "voce precisa ser admin para acessar");
	res.redirect("/");
};

export default eAdmin;


