const sortByQuestions = (a, b) => {
  if (a.question_count < b.question_count) {
    return -1;
  }
  if (a.question_count > b.question_count) {
    return 1;
  }
  return 0;
};

const sortByAnswers = (a, b) => {
  if (a.answer_count < b.answer_count) {
    return -1;
  }
  if (a.answer_count > b.answer_count) {
    return 1;
  }
  return 0;
};

module.exports = { sortByQuestions, sortByAnswers };
