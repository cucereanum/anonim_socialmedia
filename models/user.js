const mongoose = require("mongoose");
const Joi = require("Joi");
const jwt = require("jsonwebtoken");
const config = require("config");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
    default: "uploads/noImg.png",
  },

  location: {
    type: String,
    minlength: 5,
    maxlength: 200,
  },
  bio: {
    type: String,
    minlength: 5,
    maxlength: 200,
  },
  website: {
    type: String,
    minlength: 5,
    maxlength: 200,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  screams: {
    type: Array,
  },
  notifications: {
    type: Array,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, userImage: this.userImage },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateSchema(user) {
  const schema = {
    email: Joi.string().trim().email().min(5).max(200).required(),
    password: Joi.string().trim().min(5).max(200).required(),
    confirmPassword: Joi.string().trim().min(5).max(200).required(),
    name: Joi.string().trim().min(5).max(200).required(),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateSchema;
