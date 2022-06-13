const mongoose = require("mongoose");

const Courses = new mongoose.Schema({
  code:{type: Number},
      title:{type: String},
      keywords: {type: String},
      description: {type: String},
      modules: [{
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "modules"
        },
        cCode: String
      }],
      thumbnail: {type: String},
      status: {type:Number},
      expiryDate:{type:Date}
});


Courses.set('timestamps',true);


module.exports = mongoose.model("courses",Courses);