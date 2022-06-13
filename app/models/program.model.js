const mongoose = require("mongoose");

const Program = new mongoose.Schema({
  code: {type: Number,required:[true, 'Code required']},
  title: {type: String,required:[true, 'Title must not be empty']},
  keywords: {type: String,required:[true, 'Keywords must not be empty']},
  description: {type: String,required:[true, 'Description must not be empty']},
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses"
    },
    pCode: String
  }],
  modules: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "modules"
  },
    cCode: String
  }],
  thumbnail: {type:String,required:[true,'Thumbnail must not be empty']},
  status: {type:Number},
  expiryDate:{type:Date}
});


Program.set('timestamps',true);


module.exports = mongoose.model("programs",Program);