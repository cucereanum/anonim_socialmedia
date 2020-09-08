const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const { Scream } = require("../models/scream");

const { Comment, validate } = require("../models/comment");
const { Notification } = require("../models/notification");

router.get("/:id", async (req, res) => {
  const comments = await Comment.find().where("screamId", "==", req.params.id);
  console.log(comments);

  const scream = await Scream.findById(req.params.id);

  if (!scream)
    return res
      .status(404)
      .send("The scream with the given ID was not found...");

  if (comments.length === 0)
    return res.status(404).send(`There aren't comments yet...`);

  res.send(comments);
});

router.post("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const scream = await Scream.findById(req.params.id);

  if (!scream)
    return res
      .status(404)
      .send("The scream with the given ID was not found...");

  const comment = new Comment({
    body: req.body.body,
    nameFrom: req.user.name,
    userImage: req.user.userImage,
    screamId: scream._id,
    nameTo: scream.name,
  });

  const notification = new Notification({
    screamId: scream._id,
    type: "comment",
    nameFrom: req.user.name,
    nameTo: scream.name,
  });

  await notification.save();

  await comment.save();

  scream.commentCount++;
  await scream.save();

  res.send(scream);
});

router.post("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const scream = await Scream.findById(req.params.id);

  if (!scream)
    return res
      .status(404)
      .send("The scream with the given ID was not found...");

  const comment = new Comment({
    body: req.body.body,
    nameFrom: req.user.name,
    userImage: req.user.userImage,
    screamId: scream._id,
    nameTo: scream.name,
  });

  await comment.save();

  scream.commentCount++;
  await scream.save();

  res.send(scream);
});

module.exports = router;
