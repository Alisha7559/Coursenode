const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/institution-request", async (req, res) => {

  const {
    instituteName,
    contactPerson,
    email,
    phone,
    website,
    message
  } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
      }
    });

    const mailOptions = {
  from: process.env.ADMIN_EMAIL, // your Gmail/App password email
  replyTo: email,                // user's email
  to: process.env.ADMIN_EMAIL,
  subject: "New Institution Join Request",
  html: `
    <h2>Institution Join Request</h2>
    <p><b>Institution:</b> ${instituteName}</p>
    <p><b>Contact Person:</b> ${contactPerson}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Website:</b> ${website}</p>
    <p><b>Message:</b> ${message}</p>
  `
};

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Email failed"
    });

  }

});

module.exports = router;