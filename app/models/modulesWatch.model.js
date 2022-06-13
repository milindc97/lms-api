const mongoose = require("mongoose");

const ModulesWatch = new mongoose.Schema({
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionBank"
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    moduleWatchTime:{type:Number}
});


ModulesWatch.set('timestamps',true);


module.exports = mongoose.model("modulesWatch",ModulesWatch);
