const nodemailer = require("nodemailer");

async function sendEmail(email, confirmationCode) {
  // ** Use a fake email service in order to use nodemailer
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    name: "example.com",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // ** Use a real email service where you need to authenticate yourself with your actual credentials
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'Your-Email@gmail.com',
  //     pass: 'Your-Password'
  //   }
  // });

  // ** Send the email
  const info = await transporter.sendMail({
    from: "TP@example.com",
    to: email,
    subject: "Confirmation Code for the TP",
    html: `Confirmation Code for the TP: <strong>${confirmationCode}</strong>`,
  });

  // ** In case you use a fake email service,
  // * you need to check your email with the URL provided on your console
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail;
