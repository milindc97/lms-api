const mongoose = require("mongoose");

const QuestionBank = new mongoose.Schema({
  code: {type:Number},
  title: {type:String},
  keywords: {type:String},
  description: {type:String},
  quizTime:{type:Number},
  questionsCount:{type:Number},
  status: {type:Number},
  expiryDate:{type:Date},
  thumbnail: {type:String},
});


QuestionBank.set('timestamps',true);


module.exports = mongoose.model("questionBank",QuestionBank);