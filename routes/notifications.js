const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { Notification } = require("../models/notification");

router.get("/", auth, async (req, res) => {
  await Notification.updateMany({ nameTo: req.user.name }, { read: true });

  res.send("Notifications marked successfully");
});

module.exports = router;
