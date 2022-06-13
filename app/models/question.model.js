const mongoose = require("mongoose");

const Question = new mongoose.Schema({
  questionBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionBank"
  },
  question: {type:String},
  optionA: {type:String},
  optionB: {type:String},
  optionC: {type:String},
  optionD: {type:String},
  answer: {type:String},
});


Question.set('timestamps',true);


module.exports = mongoose.model("questions",Question);