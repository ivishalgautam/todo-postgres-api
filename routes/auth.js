const { login, signUp } = require("../controller/auth.controller");

const router = require("express").Router();

router.get("/login", login);
router.post("/signup", signUp);

module.exports = router;
