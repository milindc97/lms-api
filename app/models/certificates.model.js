const mongoose = require("mongoose");

const Certificates = new mongoose.Schema({
  quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionBank"
  },
  quizScoreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizScore"
},
  employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  certificate:{type:String}
});


Certificates.set('timestamps',true);


module.exports = mongoose.model("certificate",Certificates);