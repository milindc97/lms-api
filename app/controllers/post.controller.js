const db = require("../models");
const mongoose = require("mongoose");
const { post:Post,postlikes:Postlikes} = db;



exports.createPost = (req, res) => {
  if(req.body.employeeId == "61a1ca6f96a5424665736a28"){
    const post = new Post({

      message: req.body.message,
      employeeId: req.body.employeeId,
      status:1,
      likes:[],
      images:req.body.images
    });
      post.save(err => {
          if (err) {
          res.status(500).send({ message: err });
          return;
          }
  
          res.status(200).send({
          status:"success",
          message : "Post Created Successfully"
          });
      });
        
  }else{
    const post = new Post({

      message: req.body.message,
      employeeId: req.body.employeeId,
      status:0,
      likes:[],
      images:req.body.images
    });
      post.save(err => {
          if (err) {
          res.status(500).send({ message: err });
          return;
          }
  
          res.status(200).send({
          status:"success",
          message : "Please wait! Admin will approve your post."
          });
      });
        
  }
 
};

  exports.getSinglePost = (req,res)=>{
    const postId = mongoose.Types.ObjectId(req.params.id);
    Post.findById(postId,(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Single Post retrieved",
                data: data
            });
        }
    });
  }
  


exports.updateStatusPost = (req,res)=>{
  Post.findByIdAndUpdate(req.params.id,{$set:{status:1}},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Post Approved successfully",
              data: data
          });
      }
  });
}



exports.createPostLikes = (req,res)=>{
  
  const postlikes = new Postlikes({

    postId: req.body.postId,
    employeeId: req.body.employeeId
  });
    postlikes.save(err => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }

        res.status(200).send({
        status:"success",
        message : "Postlikes Created successfully!"
        });
    });
}

exports.getAllPendingPost = (req,res)=>{
  Post.aggregate([{$match:{ status: 0}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userData'}},{$sort:{createdAt:-1}}],(err,data)=>{
    if(err){
        res.status(500).send({ status:"error", message: err });
    } else {
        res.status(200).send({
          status:"success",
          message : "All Posts retrieved",
          data: data
      });
        
    }
});
}

exports.getAllActivePost = (req,res)=>{
  Post.aggregate([{$match:{ status: 1}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userData'}},{$sort:{createdAt:-1}}],(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
        for(let i=0;i < data.length;i++){
          Postlikes.find({postId:data[i]._id},(error,pdata)=>{
            data[i]['likes']=pdata;
          })
        }
        setTimeout(() => {
          res.status(200).send({
            status:"success",
            message : "All Posts retrieved",
            data: data
          });
        }, 100);
          
      }
  });
}


exports.deletePostLikes = (req,res)=>{
  const pId = mongoose.Types.ObjectId(req.params.pId);
  const eId = mongoose.Types.ObjectId(req.params.eId);
  Postlikes.findOneAndRemove({postId:pId,employeeId:eId},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } 
          res.status(200).send({
              status:"success", message : "PostLikes Deleted Successfully"
          });
    
  });
}


exports.deletePost = (req,res)=>{
  Post.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Post Deleted Successfully"
          });
      }
  });
}

