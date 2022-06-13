const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken,programAllocation: ProgramAllocation } = db;
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.getAllUsers = (req,res)=>{

  Role.find({name: { $in: "user" }},(err, roles) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      const rolesId = mongoose.Types.ObjectId(roles[0]._id);
      User.aggregate([{$match:{ roles: rolesId }},{$lookup: {from: 'roles',localField: 'roles',foreignField: '_id',as: 'rolesData'}}],(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: "Role must not be Empty" });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Users retrieved",
              data: data
          });
        }
      });
    }
  });
}

exports.getAllUsersByStatus = (req,res)=>{

  Role.find({name: { $in: "user" }},(err, roles) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      const rolesId = mongoose.Types.ObjectId(roles[0]._id);
      User.aggregate([{$match:{ roles: rolesId,status:req.body.status }},{$lookup: {from: 'roles',localField: 'roles',foreignField: '_id',as: 'rolesData'}}],(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: "Role must not be Empty" });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Users retrieved",
              data: data
          });
        }
      });
    }
  });
}

exports.getTotalEmployeeCount = (req,res)=>{
  let totalEmp=0;
  let deacEmp=0;
  let assEmp=0;
  User.find({roles: { $in: "61a1c01b164e8857359c3118" }},(err,data)=>{
    totalEmp = data.length;
    User.find({roles: { $in: "61a1c01b164e8857359c3118" },status:0},(err,data)=>{
      deacEmp = data.length;
      ProgramAllocation.distinct("employeeId",(err,data)=>{
        assEmp = data.length;
        res.status(200).send({
          status:"success",
          message : "All Users retrieved",
          totalEmp: totalEmp,
          deactiveEmp: deacEmp,
          assignedEmp:assEmp,
          pendingEmp:totalEmp - assEmp
        });
      })
     
    });
  });
  
 
}

exports.updateUser = (req,res)=>{
  User.findByIdAndUpdate(req.params.id,{$set:{profilephoto:req.body.profilephoto,firstName: req.body.firstName,lastName: req.body.last_name,salutation:req.body.salutation,email: req.body.email,mobile:req.body.mobile,dob:req.body.dob,gender:req.body.gender,department:req.body.department}},(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "User updated successfully",
          data:data
      });
    }
  });
}

exports.singleUser = (req,res)=>{
  User.findById(req.params.id,(err,data)=>{
    if(err){
        res.status(500).send({ status:"error", message: err });
    } else {
        res.status(200).send({
            status:"success",
            message : "Single User retrieved",
            data: data
        });
    }
  });
}

exports.changeUserPassword = (req,res)=>{

  User.findOne({_id: req.params.id}, (err, user) => {
      if (err) {
        res.status(500).send({status:"error", message: err });
        return;
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.currentPassword,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({
          status:"error",
          message: "Invalid Current Password!",
        });
      }

      User.findByIdAndUpdate(req.params.id,{$set:{password: bcrypt.hashSync(req.body.newPassword, 8)}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Password changed successfully"
            });
        }
      });

    });

}
exports.birthdaysonweek = (req,res)=>{

  User.aggregate([
    {
      $project: {
          firstName: 1,
          lastName:1,
          salutation:1,
          birthDate: { $dateFromParts: { 'year': { $year: new Date() }, 'month' : { $month: '$dob'}, 'day': { $dayOfMonth: '$dob' } } },
      }, 
    },
    { 
      $match: {
        $expr: {
          $eq: [{ $week: '$birthDate' }, { $week: new Date() }],
        },
      }
    },
    {
      $sort:{
        birthDate:1
      }
    }
  ],(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
  } 
  for(let i in data){
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    var curDate = new Date();
    curDate.setDate(currentDate.getDate() - 1);
      if(new Date().getDate() === data[i].birthDate.getDate() && (new Date().getMonth()+1) === data[i].birthDate.getMonth()){
        data[i].day = "Today";
      }
      if((new Date(currentDate).getDate()) === data[i].birthDate.getDate() && (new Date().getMonth()+1) === data[i].birthDate.getMonth()){
        data[i].day = "Tomorrow";
      }
      if((new Date(curDate).getDate()) === data[i].birthDate.getDate() && (new Date().getMonth()+1) === data[i].birthDate.getMonth()){
        data[i].day = "Yesterday";
      }
  }
  setTimeout(() => {
    res.status(200).send({
      status:"success",
      message : "Password changed successfully",
      data:data
  });
  }, 1000);
     
  
  })
};

exports.updateStatusUser = (req,res)=>{
  User.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},(err,data)=>{
      if(err){
          res.status(500).send({ status:"error", message: err });
      } else {
          res.status(200).send({
              status:"success",
              message : "User status updated successfully",
              data: data
          });
      }
  });
}