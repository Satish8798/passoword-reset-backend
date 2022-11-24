const mongo = require("../connect");
const bcrypt = require("bcrypt");
const express = require("express");
const nodemailer = require("nodemailer");

module.exports.reset = async (req, res, next) => {
  try {
    if (req.body.newPassword === req.body.confirmPassword) {
      const randomString = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        req.body.newPassword,
        randomString
      );
      const response = await mongo.selectedDb
        .collection("account")
        .findOneAndUpdate(
          { email: req.body.email },
          { $set: { password: hashedPassword } }
        );
      if (response) {
        res.status(200).send({
          msg: true,
        });
      }
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: error,
    });
  }
};

module.exports.create = async (req, res, next) => {
  const randomString = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, randomString);
  const account = {
    email: req.body.email,
    password: hashedPassword,
  };
  try {
    const response = await mongo.selectedDb
      .collection("account")
      .insertOne({ ...account });
    if (response) {
      res.status(200).send({
        msg: true,
      });
    }
  } catch (error) {
    if (error) {
      // console.log(error)
      res.status(500).send({
        msg: error,
      });
    }
  }
};

module.exports.search = async (req, res, next) => {
  try {
    const response = await mongo.selectedDb
      .collection("account")
      .find({ email: req.body.email })
      .toArray();
    if (response.length > 0) {
     let otp = await sendOtp(response[0].email);
     const updateResponse = await mongo.selectedDb
        .collection("account")
        .findOneAndUpdate(
          { email: req.body.email },
          { $set: { otpUsed: otp } }
        );
      if (response) {
        res.status(200).send({
          msg: true,
        });
      }
    } else {
      res.status(200).send({
        msg: false,
      });
    }
  } catch (error) {
    if (error) {
      // console.log(error)
      res.status(500).send({
        msg: error,
      });
    }
  }
};

module.exports.otpCheck = async (req, res, next) =>{
  const response = await mongo.selectedDb
      .collection("account")
      .find({ email: req.body.email })
      .toArray();
      if (response.length > 0) {
        if(parseInt(req.body.otp)===response[0].otpUsed){
          res.status(200).send({
            msg: true,
          });
        }else{
          console.log('hi')
          res.status(200).send({
            msg: false,
          });
        }
         
       } else {
         res.status(400).send({
           msg: false,
         });
       }
}


function sendOtp(email) {
  let otp= parseInt(Math.random()*10000);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmail,
      pass: process.env.password,
    },
  });
  var mailOptions = {
    from: process.env.gmail,
    to: email,
    subject: "OTP for changing password",
    html: "<h2>Please Enter this OTP to reset password <q>"+otp+"</q></h2>",

  };

 transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent" + info.response);
    }
  });

return otp;
}

