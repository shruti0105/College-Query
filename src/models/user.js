const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minLength: 7,
    trim: true,
  },
  question_count: {
    type: Number,
    default: 0,
  },
  answer_count: {
    type: Number,
    default: 0,
  },
  googleId: {
    type: String,
  },
  secret: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
