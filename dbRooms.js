const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    groupName: String,
  },
  {
    timestamps: true,
  }
);
const Rooms = mongoose.model("rooms", roomSchema);
module.exports = Rooms;
