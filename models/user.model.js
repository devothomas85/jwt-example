const mongoose = require("mongoose");

//Models
const userSchema = mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  jwttoken: String,
});

//model creation
const User = mongoose.model("User", userSchema);

module.exports = User;
