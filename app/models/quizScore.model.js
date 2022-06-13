const mongoose = require("mongoose");

const QuizScore = new mongoose.Schema({
    programId: {type:String},
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionBank"
    },
    moduleId: {type:String},
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    questionArray:{type:Array},
    examTime:{type:String},
    score:{type:Number},
    wrongAnswer:{type:Number},
    totalQuestion:{type:Number},
    correctAnswer:{type:Number},
    skipAnswer:{type:Number},
    createdAt: {type: Date},
    rating:{type:Number}
});


QuizScore.set('timestamps',true);


module.exports = mongoose.model("quizScore",QuizScore);