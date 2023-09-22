const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    message: {
      type: String,
    },
    uid: {
      type: String,
    },
    roomId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
