import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL_ADDRESS}` as string, // generated ethereal user
      pass: `${process.env.EMAIL_PASSWORD}` as string, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const sendEmail = transporter.sendMail

export default sendEmail