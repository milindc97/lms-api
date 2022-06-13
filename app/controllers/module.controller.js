const db = require("../models");
const { module: Module, questionBank: QuestionBank, modulesWatch: ModulesWatch } = db;
const mongoose = require("mongoose");


exports.createModule = (req, res) => {
  
  const module = new Module({

    code: req.body.code,
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description,
    documents:req.body.documents,
    youtubes:req.body.youtubes,
    mdocuments:req.body.mdocuments,
    thumbnail: req.body.thumbnail,
    status: req.body.status,
    rewardPoints:req.body.rewardPoints,
    quiz:req.body.quiz,
    expiryDate:req.body.expiryDate,
    moduleWatchTime:req.body.moduleWatchTime
  });

  Module.find({code:req.body.code},(err, dt)=>{
    if(dt.length > 0){
      res.status(200).send({ status: "error", message: "Code Already Exist" });
    } else {
      module.save((err, data) => {
        if (err) {
          res.status(500).send({ status:"error", message: err });
          return;
        }
        module.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.status(200).send({
            status:"success",
            message : "Module Created successfully!"
          });
        });
      });
    }
  });
  
};



exports.updateModule = (req,res)=>{
    Module.findByIdAndUpdate(req.params.id,{$set:{title: req.body.title,keywords: req.body.keywords,description: req.body.description,
      documents:req.body.documents,youtubes:req.body.youtubes,mdocuments:req.body.mdocuments,moduleWatchTime:req.body.moduleWatchTime,thumbnail: req.body.thumbnail,status:req.body.status,rewardPoints:req.body.rewardPoints,quiz:req.body.quiz,
      expiryDate:req.body.expiryDate}},(err,data)=>{
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
          message : "Module Updated successfully!"
        });
      });

  });
}

exports.getSingleModule = (req,res)=>{
  const moduleId = mongoose.Types.ObjectId(req.params.id);
  Module.aggregate([{$match:{ _id: moduleId}},{$lookup: {from: 'questionbanks',localField: 'quiz.quizId',foreignField: '_id',as: 'quizData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Module retrieved",
              data: data[0]
          });
      }
  });
}

exports.getAllModule = (req,res)=>{
  
  Module.aggregate([{$lookup: {from: 'questionbanks',localField: 'quiz.quizId',foreignField: '_id',as: 'quizData'}},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Modules retrieved",
              data: data
          });
      }
  });
}

exports.getAllActiveModule = (req,res)=>{
  
  Module.aggregate([{$match:{ status: 1}},{$lookup: {from: 'questionbanks',localField: 'quiz.quizId',foreignField: '_id',as: 'quizData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Modules retrieved",
              data: data
          });
      }
  });
}


exports.getAllInctiveModule = (req,res)=>{
  
  Module.aggregate([{$match:{ status: 0}},{$lookup: {from: 'questionbanks',localField: 'quiz.quizId',foreignField: '_id',as: 'quizData'}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Modules retrieved",
              data: data
          });
      }
  });
}

exports.getModuleIncrementalCode = (req,res)=>{
  Module.count((err,data)=>{
    if(data == 0){
      res.status(200).send({
          status:"success",
          message : "Incremental Code Created",
          data: {
              code: 1
          }
      });
    }else{
      Module.findOne({}).sort('-code').exec(function(err,data){
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


exports.deleteModule = (req,res)=>{
  Module.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Module Deleted Successfully"
          });
      }
  });
}

exports.updateStatusModule = (req,res)=>{
  Module.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Module status successfully",
              data: data
          });
      }
  });
}

exports.getModuleWatches = (req,res)=>{
  
  ModulesWatch.aggregate([{$lookup: {from: 'modules',localField: 'moduleId',foreignField: '_id',as: 'moduleDetails'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userDetails'}},{
    $group:
    {
      _id:"$employeeId",
      "participantsCount":{$sum:1},
      "module":{$push:"$moduleDetails"},
      "user":{$push:"$userDetails"},
      "createdAt":{$push:"$createdAt"}
    }
},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All ModulesWatches retrieved",
              data: data
          });
      }
  });
}

exports.getModuleWatchesByEmp = (req,res)=>{
  const empId = mongoose.Types.ObjectId(req.params.id);
  ModulesWatch.aggregate([{$match:{employeeId:empId}},{$lookup: {from: 'modules',localField: 'moduleId',foreignField: '_id',as: 'moduleDetails'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userDetails'}},{
    $group:
    {
      _id:"$employeeId",
      "participantsCount":{$sum:1},
      "module":{$push:"$moduleDetails"},
      "user":{$push:"$userDetails"},
      "createdAt":{$push:"$createdAt"}
    }
},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All ModulesWatches retrieved",
              data: data
          });
      }
  });
}

exports.getModuleWatchesByEmpAndModule = (req,res)=>{
  const empId = mongoose.Types.ObjectId(req.params.id1);
  const moduleId = mongoose.Types.ObjectId(req.params.id2);
  ModulesWatch.aggregate([{$match:{employeeId:empId,moduleId:moduleId}},{$lookup: {from: 'modules',localField: 'moduleId',foreignField: '_id',as: 'moduleDetails'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userDetails'}},{
    $group:
    {
      _id:"$employeeId",
      "participantsCount":{$sum:1},
      "module":{$push:"$moduleDetails"},
      "user":{$push:"$userDetails"},
      "createdAt":{$push:"$createdAt"},
      "moduleWatch":{$push:"$moduleWatchTime"}
    }
},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All ModulesWatches retrieved",
              data: data
          });
      }
  });
}

exports.saveModulesWatch = (req,res)=>{
  ModulesWatch.updateOne({
    moduleId: req.body.moduleId,
    employeeId:req.body.employeeId
}, {
    $set: {
      moduleWatchTime:req.body.moduleWatchTime
    }
}, {
    upsert: true
},(err,data)=>{
  if(err){
    res.status(500).send({ status:"error", message: err });
    return;
}
    res.status(200).send({
      status:"success",
      message : "Modules Watch Created successfully!",
      data:data
    });
})
}
