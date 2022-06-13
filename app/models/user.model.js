const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    employeeCode: {type:String},
    employeeId: {type:Number},
    salutation: {type:String},
    firstName: {type:String},
    lastName: {type:String},
    email: {type:String},
    password: {type:String},
    mobile: {type:Number},
    dob: {type:Date},
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    gender: {type:String},
    department:{type:String},
    status:{type:Number},
    lastLoginOn:{type:Date},
    state:{type:String},
    stateEmp:{type:String},
    cluster:{type:String},
    designation:{type:String},
    branch:{type:String},
    socket:{type:String},
    profilephoto:{type:String}
  })
);

module.exports = User;