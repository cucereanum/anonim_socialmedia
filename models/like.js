const mongoose = require("mongoose");
const Joi = require("joi");

const likeSchema = new mongoose.Schema({
  screamId: {
    type: String,
    default: "0",
  },
  name: {
    type: String,
    default: "0",
  },
});

const Like = mongoose.model("Like", likeSchema);

exports.Like = Like;
