const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const multer = require("multer");

const { reduceUserDetails } = require("../util/validators");

const { User, validate } = require("../models/user");
const { Scream } = require("../models/scream");
const { Notification } = require("../models/notification");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//get AuthenticatedUser
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const screams = await Scream.find({ name: req.user.name });
  const notifications = await Notification.find({ nameTo: req.user.name });
  screams.forEach((doc) => user.screams.push(doc));
  notifications.forEach((doc) => user.notifications.push(doc));
  res.send(user);
});

//get a User by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found...");

  const screams = await Scream.find({ name: user.name });
  const notifications = await Notification.find({ nameTo: user.name });
  screams.forEach((doc) => user.screams.push(doc));
  notifications.forEach((doc) => user.notifications.push(doc));
  res.send(user);
});

//Add userDetails to the AuthenticatedUser

router.post("/addUserDetails", auth, async (req, res) => {
  const { error } = reduceUserDetails(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.website.trim().substring(0, 4) !== "http") {
    req.body.website = `http://${req.body.website.trim()}`;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      location: req.body.location,
      website: req.body.website,
      bio: req.body.bio,
    },
    {
      new: true,
    }
  );

  await user.save();

  res.send(user);
});

//Register a user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).send("The passwords are not match...");

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(user);
});

//Upload a image to authenticated user
router.post("/uploadImage", auth, upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user._id);
  user.userImage = req.file.path;
  await user.save();
  res.status(200).send(user);
});

module.exports = router;