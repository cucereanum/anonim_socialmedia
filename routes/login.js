const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword)
        return res.status(400).send("Invalid email or password");
    try {
        user.date = Date.now();
        user.online = true;
        await user.save();
        const token = jwt.sign(
            {
                data: user.name,
                id: user._id
            },
            "secret",
            { expiresIn: "1h" }
        );
        res.send(token);
    } catch (error) {
        res.status(500).send("Something went wrong");
        console.log(error.message);
    }
});

router.get("/logout", auth, async (req, res) => {
    let user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(400).send("User not found");

    user.online = false;
    await user.save();

    res.send("Logged out successfully");
});

function validate(req) {
    const schema = {
        email: Joi.string().email().min(5).max(200).required(),
        password: Joi.string().min(5).max(200).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;
