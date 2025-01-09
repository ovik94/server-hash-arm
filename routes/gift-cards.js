const router = require("express").Router();
const giftCardsControllers = require("../controllers/gift-cards");

router.get("/", giftCardsControllers.getList);
router.post("/add", giftCardsControllers.add);
router.post("/activate", giftCardsControllers.activate);
router.post("/send-image", giftCardsControllers.sendImage);

module.exports = router;
