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

  doc = await Like.findOne({
    screamId: req.params.id,
    name: req.user.name,
  });

  if (doc && doc.name === req.user.name)
    return res.status(400).send("The scream is already liked");

  doc = new Like({
    screamId: req.params.id,
    name: req.user.name,
  });

  const notification = new Notification({
    screamId: scream._id,
    type: "like",
    nameFrom: req.user.name,
    nameTo: scream.name,
  });

  await notification.save();

  scream.likeCount++;
  await scream.save();

  await doc.save();
  res.send(doc);
});

module.exports = router;
