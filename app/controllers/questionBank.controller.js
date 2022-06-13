const db = require("../models");
const { questionBank: QuestionBank,question:Question } = db;



exports.createQuestionBank = (req, res) => {
  const questionBank = new QuestionBank({
    code: req.body.code,
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description,
    quizTime:req.body.quizTime,
    questionsCount:req.body.questionsCount,
    status: req.body.status,
    expiryDate:req.body.expiryDate,
    thumbnail:req.body.thumbnail
  });

  QuestionBank.find({code:req.body.code},(err, dt)=>{
    if(dt.length > 0){
      res.status(200).send({ status: "error", message: "Code Already Exist" });
    } else {
        questionBank.save((err, data) => {
            if (err) {
            res.status(500).send({ status:"error", message: err });
            return;
            } else {
                res.status(200).send({
                    status:"success",
                    message : "Question Bank created successfully",
                    data: data
                });
            }
        });
    }
    });
};

exports.updateQuestionBank = (req,res)=>{
    QuestionBank.findByIdAndUpdate(req.params.id,{$set:{title: req.body.title,keywords: req.body.keywords,description: req.body.description,
        quizTime:req.body.quizTime,questionsCount:req.body.questionsCount,status:req.body.status,expiryDate:req.body.expiryDate,thumbnail:req.body.thumbnail}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Question Bank updated successfully",
                data: data
            });
        }
    });
}

exports.getSingleQuestionBank = (req,res)=>{
  QuestionBank.findById(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "Single Question Bank retrieved",
              data: data
          });
      }
  });
}

exports.getAllQuestionBank = (req,res)=>{
  QuestionBank.find({},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "All Question Bank retrieved",
              data: data
          });
      }
  }).sort({"createdAt":-1});
}

exports.getAllActiveQuestionBank = (req,res)=>{
    QuestionBank.find({status:1},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "All Question Bank retrieved",
                data: data
            });
        }
    });
  }

  exports.getAllInactiveQuestionBank = (req,res)=>{
    QuestionBank.find({status:0},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "All Question Bank retrieved",
                data: data
            });
        }
    });
  }

exports.getQuestionBankIncrementalCode = (req,res)=>{
    QuestionBank.count((err,data)=>{
        if(data == 0){
          res.status(200).send({
              status:"success",
              message : "Incremental Code Created",
              data: {
                  code: 1
              }
          });
        }else{
            QuestionBank.findOne({}).sort('-code').exec(function(err,data){
                console.log(data);
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


exports.deleteQuestionBank = (req,res)=>{
  QuestionBank.findByIdAndRemove(req.params.id,(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success", message : "Question Bank Deleted Successfully"
          });
      }
  });
}

exports.updateStatusQuestionBank = (req,res)=>{
    if(req.body.status == 1){
        QuestionBank.findById(req.params.id,(err,qbData)=>{
            Question.find({questionBankId:req.params.id},(err,qData)=>{
                if(err){
                    res.status(500).send({ status:"error", message: err });
                } else {
                    if(qbData.questionsCount <= qData.length && qbData.quizTime !== 0){
                        QuestionBank.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
                            if(err){
                                res.status(200).send({ status:"error", message: err });
                            } else {
                                res.status(200).send({
                                    status:"success",
                                    message : "Question Bank status successfully",
                                    data: data
                                });
                            }
                        });
                        
                    }else{
                        res.status(200).send({ status:"error", message: "Please check questions count and quiz time." });
                    }
                }
            });
        
        })
    }else{
        QuestionBank.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
            if(err){
                res.status(200).send({ status:"error", message: err });
            } else {
                res.status(200).send({
                    status:"error",
                    message : "Question Bank status successfully",
                    data: data
                });
            }
        });
    }
    
}
