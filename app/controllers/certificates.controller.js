const db = require("../models");
const mongoose = require("mongoose");
const { certificate:Certificates,user:User,questionBank: QuestionBank} = db;
var nodemailer = require('nodemailer');


exports.createCertificateData = (req, res) => {
  const certificate = new Certificates({

    quizScoreId: req.body.quizScoreId,
    employeeId: req.body.employeeId,
    quizId: req.body.quizId,
    certificate: req.body.certificate
  });

  certificate.save(err => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        User.findById(req.body.employeeId,(err,data)=>{
            QuestionBank.findById(req.body.quizId,(err,qdata)=>{
                var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: 'lndsupport@fusionmicrofinance.in',
                  pass: 'Msquare@22'
                }
              });
              
              var mailOptions = {
                from: 'lndsupport@fusionmicrofinance.in',
                to: data.email,
                subject: data.salutation + ' ' + data.firstName + ' '+ data.lastName +', here is your certificate ' +qdata.title + ' quiz',
                html: '<!DOCTYPE html>\
                <html>\
                <body style="margin:10px 15%">\
                <div style="text-align:center;">\
                <a href=""><img src="https://fusionmicrofinance.com/wp-content/uploads/2021/10/cropped-FUSION-LOGO.png"/></a>\
                </div>\
                <h1>Congratulations! Here is your certificate for'+qdata.title + ' quiz.</h1>\
                <p>Congratulations on receiving '+qdata.title + ' certificate from Fusion Microfinance! You now download your certificate.</p>\
                <p>Your certificate is available in an online format so that you can retreive it anywhere at any time, and easily share the details of your acheivement.</p>\
                <a style="cursor:pointer" href="https://nice-lamarr.134-209-155-58.plesk.page/certificates" target="_blank"><button style="background-color:#ffbc2c;color:white;border:unset;padding:15px 20px;font-size:20px;margin-top:20px;border-radius:25px">View Certificate</button></a>\
                </body>\
                </html>\
                '
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(500).send({ status:"error", message: error });
                } else {
                    res.status(200).send({
                        status:"success",
                        message : "Certificate Created successfully!"
                        });
                  
                }
              });
            });
        });
        
        
    });
};

exports.getSingleCertificate = (req,res)=>{
    const certificateId = mongoose.Types.ObjectId(req.params.id);
    Certificates.aggregate([{$match:{ _id: certificateId }},{$lookup: {from: 'quizscores',localField: 'quizScoreId',foreignField: '_id',as: 'quizScoreData'}}
    ,{$lookup: {from: 'questionbanks',localField: 'quizId',foreignField: '_id',as: 'quizData'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userData'}}],(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Single Certificate retrieved",
                data: data[0]
            });
        }
    });
  }


  exports.getSingleCertificateByQuizAndEmpId = (req,res)=>{
    const quizScoreId = mongoose.Types.ObjectId(req.params.id1);
    const empId = mongoose.Types.ObjectId(req.params.id2);
    Certificates.aggregate([{$match:{ quizScoreId: quizScoreId,employeeId:empId }},{$lookup: {from: 'quizscores',localField: 'quizScoreId',foreignField: '_id',as: 'quizScoreData'}}
    ,{$lookup: {from: 'questionbanks',localField: 'quizId',foreignField: '_id',as: 'quizData'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userData'}}],(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            console.log(data);
            res.status(200).send({
                status:"success",
                message : "Single Certificate retrieved",
                data: data[0]
            });
        }
    });
  }
  
  exports.getAllCertificates = (req,res)=>{
    const employeeId = mongoose.Types.ObjectId(req.params.id);
    Certificates.aggregate([{$match:{ employeeId: employeeId }},{$lookup: {from: 'quizscores',localField: 'quizScoreId',foreignField: '_id',as: 'quizScoreData'}}
    ,{$lookup: {from: 'questionbanks',localField: 'quizId',foreignField: '_id',as: 'quizData'}},{$lookup: {from: 'users',localField: 'employeeId',foreignField: '_id',as: 'userData'}}],(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "All Certificates retrieved",
                data: data
            });
        }
    });
  }
