const db = require("../models");
const mongoose = require("mongoose");
const { course:Courses, module:Module, questionBank:QuestionBank } = db;



exports.createCourse = (req, res) => {
  const course = new Courses({

    code: req.body.code,
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    status: req.body.status,
    modules:req.body.modules,
    expiryDate:req.body.expiryDate
  });

  Courses.find({code:req.body.code},(err, dt)=>{
    if(dt.length > 0){
      res.status(200).send({ status: "error", message: "Code Already Exist" });
    } else {
      course.save((err, data) => {
        if (err) {
          res.status(500).send({ status:"error", message: err });
          return;
        }
        course.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send({
            status:"success",
            message : "Course Created successfully!"
          });
        });
      });
    }
  });
};



exports.updateCourse = (req,res)=>{
    Courses.findByIdAndUpdate(req.params.id,{$set:{title: req.body.title,keywords: req.body.keywords,description: req.body.description,thumbnail: req.body.thumbnail,status: req.body.status, modules:req.body.modules,expiryDate:req.body.expiryDate}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } 
        data.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send({
            status:"success",
            message : "Course Updated successfully!"
          });
        });

    });
}

exports.getSingleCourse = (req,res)=>{
  const courseId = mongoose.Types.ObjectId(req.params.id);
  Courses.aggregate([{$match:{ _id: courseId }},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Course retrieved",
              data: data[0]
          });
      }
  });
}

exports.getAllCourse = (req,res)=>{
  Courses.aggregate([{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Courses retrieved",
              data: data
          });
      }
  });
}

exports.getAllActiveCourse = (req,res)=>{
  Courses.aggregate([{$match:{status:1}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Courses retrieved",
              data: data
          });
      }
  });
}

exports.getAllInactiveCourse = (req,res)=>{
  Courses.aggregate([{$match:{status:0}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Courses retrieved",
              data: data
          });
      }
  });
}

exports.getCourseIncrementalCode = (req,res)=>{
  Courses.count((err,data)=>{
    if(data == 0){
      res.status(200).send({
          status:"success",
          message : "Incremental Code Created",
          data: {
              code: 1
          }
      });
    }else{
      Courses.findOne({}).sort('-code').exec(function(err,data){
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
          let code = {code: data.code+1};
            res.status(200).send({
                status:"success",
                message : "Incremental Code Created",
                data: code
            });
        }
    });
    }
});
}


exports.deleteCourse = (req,res)=>{
  Courses.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Course Deleted Successfully"
          });
      }
  });
}

exports.updateStatusCourse = (req,res)=>{
  Courses.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Course status successfully",
              data: data
          });
      }
  });
}
