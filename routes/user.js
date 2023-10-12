const router = require("express").Router();
const userControllers = require('../controllers/user');

router.get("/list", userControllers.getUserList);

module.exports = router;
