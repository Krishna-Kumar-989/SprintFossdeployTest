const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  joined: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
