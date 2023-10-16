const router = require("express").Router();
const userControllers = require('../controllers/user');

router.get("/list", userControllers.getUserList);
router.post("/add", userControllers.addUser);
router.post("/login", userControllers.login);
router.post("/edit", userControllers.editUser);
router.post("/delete", userControllers.deleteUser);

module.exports = router;
