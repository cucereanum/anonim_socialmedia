const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { Scream } = require("../models/scream");
const { Like } = require("../models/like");
const { Notification } = require("../models/notification");

router.get("/:id", auth, async (req, res) => {
  const scream = await Scream.findById(req.params.id);
  if (!scream)
    return res
      .status(404)
      .send("The scream with the given ID was not found...");

  let doc = await Like.findOne({
    screamId: req.params.id,
    name: req.user.name,
  });

  if (doc && doc.name === req.user.name) {
    await Like.deleteOne(doc);
    await Notification.deleteOne({
      nameFrom: req.user.name,
      screamId: doc.screamId,
      type: "like",
    });
    scream.likeCount--;
    await scream.save();
    res.status(200).send("Unliked successfully");
  } else {
    res.status(400).send("Scream already unliked...");
  }
});
module.exports = router;
