const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      "Zen-Class Doubt",
      "Placement-Related",
      "Coordination-Related",
      "Pre-Bootcamp Related",
    ],
    required: true,
  },
  language: {
    type: String,
    enum: ["Tamil", "English", "Hindi"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  From: {
    type: String,
    required: true,
  },
  till: {
    type: String,
    required: true,
  },
  // Add more dropdown fields as needed
});

const Query = mongoose.model("query", querySchema);

module.exports = Query;
