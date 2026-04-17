const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: String,
  topic: String,
  score: Number,
  weakAreas: [String],
  decision: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LearningSession", sessionSchema);