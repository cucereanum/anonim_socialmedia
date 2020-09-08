const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  nameFrom: {
    type: String,
  },
  nameTo: {
    type: String,
  },
  type: {
    type: String,
  },
  screamId: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("Notifications", notification);

exports.Notification = Notification;
