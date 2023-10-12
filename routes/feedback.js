const router = require("express").Router();
const feedbackControllers = require('../controllers/feedback');

router.get("/list", feedbackControllers.getList);

router.post("/send", feedbackControllers.sendFeedback);

module.exports = router;
