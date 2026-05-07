const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  event: { type: String, required: true },
  user: { type: String, required: true }, // Username or IP
  status: { type: String, enum: ["Success", "Failed"], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);
