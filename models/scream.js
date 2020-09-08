const mongoose = require("mongoose");
const Joi = require("joi");

const screamSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 250,
  },

  name: {
    type: String,
    default: null,
  },
  userImage: {
    type: String,
    default: null,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Scream = mongoose.model("Scream", screamSchema);

function validateSchema(scream) {
  const schema = {
    body: Joi.string().trim().min(2).max(250).required(),
  };
  return Joi.validate(scream, schema);
}

exports.Scream = Scream;
exports.validate = validateSchema;
