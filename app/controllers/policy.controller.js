const db = require("../models");
const mongoose = require("mongoose");
const { policy:Policy,config:Config} = db;



exports.createPolicy = (req, res) => {
  const policy = new Policy({

    icon: req.body.icon,
    name: req.body.name,
    percentage: req.body.percentage
  });
    policy.save(err => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }

        res.status(200).send({
        status:"success",
        message : "Policy Created successfully!"
        });
    });
      
};

exports.updateTopMessageConfig = (req, res) => {
    
        Config.updateOne({},{$set:{message: req.body.message}},(err,data)=>{
            if(err){
                res.status(500).send({ status:"error", message: err });
            } 
            if(data.matchedCount == 0){
                const config = new Config({

                    message: req.body.message
                  });
                    config.save(err => {
                        if (err) {
                        res.status(500).send({ message: err });
                        return;
                        }
                
                        res.status(200).send({
                        status:"success",
                        message : "Message successfully saved!"
                        });
                    });
            }else{
              res.status(200).send({
                status:"success",
                message : "Message successfully saved!"
              });
            }
        });
  };


  exports.getTopMessageConfig = (req, res) => {
    
    Config.find({},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } 
          res.status(200).send({
            status:"success",
            message : "Top Message Fetched!",
            data:data[0]
          });
    });
};


  exports.getSinglePolicy = (req,res)=>{
    const policyId = mongoose.Types.ObjectId(req.params.id);
    Policy.findById(policyId,(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Single Policy retrieved",
                data: data
            });
        }
    });
  }
  



exports.updatePolicy = (req,res)=>{
    Policy.findByIdAndUpdate(req.params.id,{$set:{icon: req.body.icon,
        name: req.body.name,
        percentage: req.body.percentage}},(err,data)=>{
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
            message : "Policy Updated successfully!"
          });
        });
        

    });
}

exports.getSinglePolicy = (req,res)=>{
  const policyId = mongoose.Types.ObjectId(req.params.id);
  Policy.findById(policyId,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Policy retrieved",
              data: data
          });
      }
  });
}

exports.getSinglePolicyByPercentage = (req,res)=>{
    Policy.find({percentage:req.params.per},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Single Policy retrieved",
                data: data[0]
            });
        }
    });
  }

exports.getAllPolicy = (req,res)=>{
  Policy.find({},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Policies retrieved",
              data: data
          });
      }
  });
}


exports.deletePolicy = (req,res)=>{
  Policy.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Policy Deleted Successfully"
          });
      }
  });
}

