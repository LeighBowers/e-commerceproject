// const express = require('express');
require("dotenv").config()
const nodemailer = require('nodemailer');
const User = require("../models/user");
// const user = require("./user.Routes")
const express = require("express")
const app = express.Router()

app.post('/', (req, res) => {
    let { name, email, phone, subject, message } = req.body


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });


    const mailOptions = {
        from: email,
        to: 'leighsylvester9@gmail.com',
        subject: 'New contact from your portfolio',
        text: `${name} has contact you please contact them back on ${phone}
         ${subject}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);
            res.status(400).send({ msg: "Email not send" });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ msg: "Email has been sent successfully" });
        }
    });

})
module.exports = app




