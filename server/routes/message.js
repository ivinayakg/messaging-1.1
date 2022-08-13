const express = require("express");
const {
  addMessage,
  getAllMessages,
  pollingForMessages,
  removePolling,
} = require("../controller/message");
const router = express.Router();

// router.get("/:username/getALL");
router.get("/polling", pollingForMessages);
router.get("/unpoll", removePolling);
router.post("/new", addMessage);
router.get("/channel/:channelId/messages", getAllMessages);

module.exports = router;
