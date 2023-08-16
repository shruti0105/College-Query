const mongoose = require("mongoose");

mongoose.connect(
  'mongodb://127.0.0.1:27017/database',
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("MongoDB Connected successfully");
  })