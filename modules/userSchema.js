const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 30,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  itemName: {
    type: String,
    required: true,
  },
  location: String,
  ownerinfo: String,
  description: String,
  image: [
    {
      url: String,
      filename: String,
    },
  ],
});
module.exports = mongoose.model("foundData", userSchema);
