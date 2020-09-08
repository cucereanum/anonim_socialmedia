const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    maxlength: 250,
  },
  nameFrom: {
    type: String,
    default: null,
  },
  userImage: {
    type: String,
    default: null,
  },
  screamId: {
    type: String,
    default: null,
  },
  nameTo: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

function validateSchema(comment) {
  const schema = {
    body: Joi.string().trim().max(250).required(),
  };
  return Joi.validate(comment, schema);
}

exports.Comment = Comment;
exports.validate = validateSchema;
