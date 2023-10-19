const router = require("express").Router();
const feedbackControllers = require('../controllers/feedback');

router.get("/list", feedbackControllers.getRequestsList);
router.post("/update", feedbackControllers.updateRequestsList);
router.post("/send", feedbackControllers.sendFeedback);

module.exports = router;
