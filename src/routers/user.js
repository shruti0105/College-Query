const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Question = require("../models/question");
const Answer = require("../models/answer");
const { sortByQuestions, sortByAnswers } = require("../functions/sortMethods");
require("../db/mongoose");

router.get("/", (req, res) => {
  res.render("intro");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/cards/:userId", (req, res) => {
  res.render("cards");
});

router.get("/cards", (req, res) => {
  res.render("cards");
});

router.get("/questions", async (req, res) => {
  let category = req.query.cat.toString();
  if (category.includes("%20")) {
    category = category.replace("%20", " ");
  }
  const questions = await Question.find({ category: req.query.cat });
  const users = await User.find({});
  // console.log(users);
  const users_by_questions = users.sort(sortByQuestions).reverse();
  const users_by_answers = users.sort(sortByAnswers).reverse();
  const most_questions_asked = [];
  const most_answers_given = [];
  let stoppingIndex = 0;
  console.log(users_by_questions);
  console.log(users_by_answers);
  if (users_by_questions.length < 5) {
    stoppingIndex = users_by_questions.length;
  } else {
    stoppingIndex = 5;
  }
  for (var i = 0; i < stoppingIndex; i++) {
    // console.log(users_by_questions.at(i));
    most_questions_asked.push({
      username: users_by_questions[i].username,
      index: i + 1,
    });
    most_answers_given.push({
      username: users_by_answers[i].username,
      index: i + 1,
    });
  }
  // console.log(users_by_questions);
  // console.log(users_by_answers);
  // console.log(questions);
  let count = 1;
  const questions_arr = [];
  // console.log(questions);
  questions.forEach((question) => {
    questions_arr.push({
      q_id: question._id.valueOf(),
      q_txt: question.question,
      index: count,
      disabled: "disabled",
    });
    count++;
  });
  // console.log(questions_arr);
  res.render("questions", {
    title: req.query.cat,
    disabled: "disabled",
    questions_arr,
    most_questions_asked,
    most_answers_given,
  });
});

router.get("/questions/:userid", async (req, res) => {
  let category = req.query.cat.toString();
  if (category.includes("%20")) {
    category = category.replace("%20", " ");
  }
  var questions = await Question.find({ category });
  const users = await User.find({});
  // console.log(users);
  const users_by_questions = users.sort(sortByQuestions).reverse();
  const users_by_answers = users.sort(sortByAnswers).reverse();
  const most_questions_asked = [];
  const most_answers_given = [];
  let stoppingIndex = 0;
  console.log(users_by_questions);
  console.log(users_by_answers);
  if (users_by_questions.length < 5) {
    stoppingIndex = users_by_questions.length;
  } else {
    stoppingIndex = 5;
  }
  for (var i = 0; i < stoppingIndex; i++) {
    // console.log(users_by_questions.at(i));
    most_questions_asked.push({
      username: users_by_questions[i].username,
      index: i + 1,
    });
    most_answers_given.push({
      username: users_by_answers[i].username,
      index: i + 1,
    });
  }
  let count = 1;
  const questions_arr = [];
  // console.log(questions);
  questions.forEach((question) => {
    questions_arr.push({
      q_id: question._id.valueOf(),
      q_txt: question.question,
      index: count,
      disabled: "",
    });
    count++;
  });
  console.log(most_questions_asked);
  // console.log(questions_arr);
  res.render("questions", {
    title: req.query.cat,
    disabled: "",
    questions_arr,
    most_questions_asked,
    most_answers_given,
  });
});

router.get("/answers", async (req, res) => {
  const question = await Question.findById(
    mongoose.Types.ObjectId(req.query.q_id)
  );
  const answers = await Answer.find({
    ref_question: mongoose.Types.ObjectId(req.query.q_id),
  });
  let answers_list = [];
  for (let i = 0; i < answers.length; i++) {
    let fetchedAuthor = await User.findById(answers[i].answer.author);
    var obj = {};
    obj["ans_txt"] = answers[i].answer.answer_txt;
    obj["author"] = fetchedAuthor.username;
    answers_list.push(obj);
  }
  console.log(answers_list);
  const no_of_answers = answers.length;
  // console.log(req);
  res.render("answers", {
    disabled: "disabled",
    q_txt: question.question,
    answers_list,
    no_of_answers,
  });
});

router.get("/answers/:id", async (req, res) => {
  console.log(req.query);
  console.log(req.url);
  const question = await Question.findById(
    mongoose.Types.ObjectId(req.query.q_id)
  );
  // const parameters = [];
  console.log(question);
  const answers = await Answer.find({
    ref_question: mongoose.Types.ObjectId(req.query.q_id),
  });
  console.log(answers);
  // const user = await User.findById(mongoose.Types.ObjectId(req.params.id));
  let answers_list = [];
  // answers.forEach(async (answer) => {
  //   let fetchedAuthor = await User.findById(answer.answer.author);
  //   // console.log(fetchedAuthor.username);
  //   answers_list.push({
  //     ans_txt: answer.answer.answer_txt,
  //     author: fetchedAuthor.username,
  //   });
  // });
  for (let i = 0; i < answers.length; i++) {
    let fetchedAuthor = await User.findById(answers[i].answer.author);
    var obj = {};
    obj["ans_txt"] = answers[i].answer.answer_txt;
    obj["author"] = fetchedAuthor.username;
    answers_list.push(obj);
  }
  console.log(answers_list);
  const no_of_answers = answers.length;
  res.render("answers", {
    disabled: "",
    q_txt: question.question,
    answers_list,
    no_of_answers,
  });
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const emailExist = await User.findOne({ email: req.body.email });
  const usernameExists = await User.findOne({ username: req.body.username });
  if (emailExist) {
    res.render("register", { error: "Email already exists" });
  } else if (req.body.password.toString().length < 6) {
    res.render("register", {
      error: "Minimum length of the password must be 6",
    });
  } else if (usernameExists) {
    res.render("register", {
      error: "This username is already taken",
    });
  } else {
    const salt = await bcrypt.genSalt(7);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    try {
      const savedUser = await user.save();
      console.log(savedUser);
      const token = jwt.sign({ _id: savedUser._id },"Mylittlesecret");
      req.header("auth-token", token);
      res.redirect(`/cards/${savedUser._id.valueOf()}`);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const EmailExists = await User.findOne({ email: req.body.email });
  if (!EmailExists) {
    res.render("login", { error: "No such email exists" });
  } else {
    const user = await User.findOne({ email: req.body.email });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (validPassword) {
      const token = jwt.sign({ _id: user._id }, "Mylittlesecret");
      res.header("auth-token", token);
      res.redirect(`/cards/${user._id.valueOf()}`);
    } else {
      res.render("login", { error: "Invalid password" });
    }
  }
});

router.post("/cards", async (req, res) => {
  console.log(req.body);
  console.log(req.headers.referer);
  const referedUrl = req.headers.referer
    .toString()
    .replace("cards", "questions");
  res.redirect(referedUrl + "?cat=" + req.body.category);
});

router.post("/questions", async (req, res) => {
  console.log(req.body);
  const refererUrl = req.headers.referer.toString();
  const userId = refererUrl.slice(
    refererUrl.lastIndexOf("/") + 1,
    refererUrl.indexOf("?")
  );
  let category = refererUrl.slice(refererUrl.indexOf("=") + 1);
  if (category.includes("%20")) {
    category = category.replace("%20", " ");
  }
  console.log(category);
  console.log(userId);
  const question = new Question({
    question: req.body.question,
    category,
    owner: mongoose.Types.ObjectId(userId),
  });
  try {
    const savedQuestion = await question.save();
    const user = await User.findById(mongoose.Types.ObjectId(userId));
    console.log(user);
    user.question_count = user.question_count + 1;
    console.log(user);
    User.updateOne(
      { _id: mongoose.Types.ObjectId(userId) },
      { question_count: user.question_count },
      (err, docs) => {
        res.redirect("/questions/" + userId + "?cat=" + category);
      }
    );
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/answers", async (req, res) => {
  const question = await Question.findById(req.body.q_id);
  const refererUrl = req.headers.referer
    .toString()
    .replace("questions", "answers");
  res.redirect(refererUrl + "&q_id=" + req.body.q_id);
});

router.post("/answer_qn", async (req, res) => {
  console.log(req.body);
  const refererUrl = req.headers.referer.toString();
  console.log(refererUrl);
  const q_id = refererUrl.slice(refererUrl.lastIndexOf("=") + 1);
  const user_id = refererUrl.slice(
    refererUrl.lastIndexOf("/") + 1,
    refererUrl.indexOf("?")
  );
  console.log(user_id);
  console.log(q_id);
  const answer = new Answer({
    ref_question: mongoose.Types.ObjectId(q_id),
    answer: {
      answer_txt: req.body.answer,
      author: mongoose.Types.ObjectId(user_id),
    },
  });
  try {
    const savedAnswer = await answer.save();
    const user = await User.findById(mongoose.Types.ObjectId(user_id));
    user.answer_count = user.answer_count + 1;
    User.updateOne(
      { _id: mongoose.Types.ObjectId(user_id) },
      { answer_count: user.answer_count },
      (err, docs) => {
        res.redirect(refererUrl);
      }
    );
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
