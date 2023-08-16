const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    ref_question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    answer: {
      answer_txt: {
        type: String,
        trim: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
