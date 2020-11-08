const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { Scream, validate } = require("../models/scream");
const { Like } = require("../models/like");
const { Comment } = require("../models/comment");
const { Notification } = require("../models/notification");

router.get("/", async (req, res) => {
    try {
        const screams = await Scream.find().sort({ date: -1 });
        res.send(screams);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const scream = new Scream({
            body: req.body.body,
            name: req.user.name,
            userImage: req.user.userImage
        });

        await scream.save();
        res.send(scream);
    } catch (error) {
        res.status(500).send("Something was wrong...");
    }
});

router.get("/:id", async (req, res) => {
    const scream = await Scream.findById(req.params.id);

    if (!scream)
        return res
            .status(404)
            .send("The scream with the given ID was not found...");

    res.send(scream);
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const scream = await Scream.findByIdAndUpdate(
        req.params.id,
        { body: req.body.body },
        { new: true }
    );

    if (!scream)
        return res
            .status(404)
            .send("The scream with the given ID was not found...");

    res.send(scream);
});

router.delete("/:id", auth, async (req, res) => {
    const scream = await Scream.findOne({ _id: req.params.id });

    if (!scream)
        return res
            .status(404)
            .send("The scream with the given ID was not found...");

    if (scream.name !== req.user.name)
        return res.status(403).send("Unauthorized");

    await Like.deleteMany({ screamId: req.params.id });

    await Comment.deleteMany({ screamId: req.params.id });

    await Notification.deleteMany({ screamId: req.params.id });

    await Scream.deleteOne(scream);

    res.send(`The ${scream._id} was deleted successfully`);
});

module.exports = router;
