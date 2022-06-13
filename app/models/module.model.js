const mongoose = require("mongoose");

const Modules = new mongoose.Schema({
  code: {type: Number},
    title: {type: String},
    keywords: {type: String},
    description: {type: String},
    youtubeUrl:{type:String},
    documents:{type:Array},
    youtubes:{type:Array},
    mdocuments:{type:Array},
    thumbnail: {type: String},
    quiz : [{
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionBank"
      },
    }],
    rewardPoints:{type:Number},
    status:{type:Number},
    expiryDate:{type:Date},
    moduleWatchTime:{type:Number}
});


Modules.set('timestamps',true);


module.exports = mongoose.model("modules",Modules);