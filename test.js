const express= require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'ganesansatishm7@gmail.com',
        pass: process.env.password
    }
});
var mailOptions = {
    from: 'ganesansatishm7@gmail.com',
    to: 'ganesansatish07@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'Hi Youtuber!!'
  }

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error);
    }else{
        console.log('Email sent'+ info.response);
    }
});

const app =express();

app.use(express.json());



app.listen(8000);