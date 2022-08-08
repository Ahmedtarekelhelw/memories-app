const router = require("express").Router();
const { refreshToken } = require("../controllers/refresh");

router.get("/", refreshToken);

module.exports = router;
