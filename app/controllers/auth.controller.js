const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.signup = (req, res) => {
  if(req.body.employeeCode == "" || req.body.employeeCode == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  if(req.body.password == "" || req.body.password == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  if(req.body.roles == "" || req.body.roles == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  const user = new User({
    employeeCode: req.body.employeeCode,
    salutation:req.body.salutation,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    dob: req.body.dob,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    status: (req.body.status == "" || req.body.status == undefined) ? 0 : req.body.status
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find({name: { $in: req.body.roles }},(err, roles) => {
          if (err) {
            res.status(500).send({ message: "Role must not be empty" });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: "Role must not be empty" });
          return;
        }

        user.roles = [role._id];    
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.forgot_password = (req, res) => {
    User.find({dob:req.body.dob,mobile:req.body.mobile},(err,data)=>{
      if(data.length == 0){
        return res.status(200).send({message: "Please enter correct data." });
      }else{
        const empId = mongoose.Types.ObjectId(data[0]._id);
        User.findByIdAndUpdate(empId,{$set:{password: bcrypt.hashSync(req.body.password, 8)}},(err,data)=>{
          if(err){
            res.status(500).send({ status:"error", message: err });
          } else {
            res.status(200).send({
                status:"success",
                message : "New Password created successfully"
            });
          }
        });
      }
    });
};

exports.signin = (req, res) => {

  if(req.body.credential == "" || req.body.credential == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  if(req.body.password == "" || req.body.password == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }


  User.findOne({$or:[{email: req.body.credential},{employeeCode:req.body.credential}]})
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ status:"error", message: "Wrong Credential." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        console.log(user.roles[i])
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      // let rl = req.body.role;
      // if(!authorities.includes("ROLE_" + rl.toUpperCase())){
      //   return res.status(401).send({
      //     status:"error",
      //     accessToken: null,
      //     message: "Sorry! You don't have permission to access this portal",
      //   });
      // }

      if(user.status != 1){
        return res.status(401).send({
          status:"error",
          accessToken: null,
          message: "Your account is locked. Please contact Administrator",
        });
      }

      User.findByIdAndUpdate(user._id,{$set:{lastLoginOn: new Date()}},(err,data)=>{
        if(err){
          console.log(err);
        } 

      });

      res.status(200).send({
        status:"success",
        message : "Login successfully",
        data: {
          id: user._id,
          salutation:user.salutation,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: authorities,
          mobile:user.mobile,
          dob:user.dob,
          gender:user.gender,
          accessToken: token,
          refreshToken: refreshToken,
          lastLoginOn: user.lastLoginOn
        }
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({status:"error", message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({status:"error", message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
