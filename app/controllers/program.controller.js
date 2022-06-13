const db = require("../models");
const mongoose = require("mongoose");
const { program:Program, course:Courses ,module:Module} = db;



exports.createProgram = (req, res) => {
  const program = new Program({

    code: req.body.code,
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    status: req.body.status,
    courses:req.body.courses,
    modules:req.body.modules,
    expiryDate:req.body.expiryDate
  });
  Program.find({code:req.body.code},(err, dt)=>{
    if(dt.length > 0){
      res.status(200).send({ status: "error", message: "Code Already Exist" });
    } else {
      program.save((err, data) => {
        if (err) {
          res.status(500).send({ status:"error", message: err });
          return;
        }
        program.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send({
            status:"success",
            message : "Program Created successfully!"
          });
        });
      
      });
    }
  });
};

exports.updateProgram = (req,res)=>{
    Program.findByIdAndUpdate(req.params.id,{$set:{title: req.body.title,keywords: req.body.keywords,description: req.body.description,thumbnail: req.body.thumbnail,status: req.body.status,courses:req.body.courses,
      modules:req.body.modules,expiryDate:req.body.expiryDate}},(err,data)=>{
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
            message : "Program Updated successfully!"
          });
        });
        

    });
}

exports.getSingleProgram = (req,res)=>{
  const programId = mongoose.Types.ObjectId(req.params.id);
  Program.aggregate([{$match:{ _id: programId }},{$lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'coursesData'}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Program retrieved",
              data: data[0]
          });
      }
  });
}

exports.getSingleProgramByCode = (req,res)=>{
  const code=  parseInt(req.params.id);
  Program.aggregate([{$match:{ code: code }},{$lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'coursesData'}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Program retrieved",
              data: data[0]
          });
      }
  });
}

exports.getAllProgram = (req,res)=>{
  Program.aggregate([{$lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'coursesData'}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Programs retrieved",
              data: data
          });
      }
  });
}

exports.getAllActiveProgram = (req,res)=>{
  Program.aggregate([{$match:{ status: 1}},{$lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'coursesData'}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Programs retrieved",
              data: data
          });
      }
  });
}


exports.getAllInactiveProgram = (req,res)=>{
  Program.aggregate([{$match:{ status: 0}},{$lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'coursesData'}},{$lookup: {from: 'modules',localField: 'modules.moduleId',foreignField: '_id',as: 'modulesData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Programs retrieved",
              data: data
          });
      }
  });
}

exports.getProgramIncrementalCode = (req,res)=>{
 
  Program.count((err,data)=>{
    if(data == 0){
      res.status(200).send({
          status:"success",
          message : "Incremental Code Created",
          data: {
              code: 1
          }
      });
    }else{
      Program.findOne({}).sort('-code').exec(function(err,data){
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


exports.deleteProgram = (req,res)=>{
  Program.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Program Deleted Successfully"
          });
      }
  });
}


exports.updateStatusProgram = (req,res)=>{
  Program.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Program status successfully",
              data: data
          });
      }
  });
}