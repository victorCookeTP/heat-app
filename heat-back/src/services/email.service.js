const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTestLinkEmail = async (email, testLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Access to your test",
    text: `Click on the following link to START your test: ${testLink}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendTestResultsEmail = async (
  email,
  testScore,
  audioScore,
  finalResult
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Test Results",
    text: `Here are your test results:\n\nTest Score: ${testScore}%\nAudio Score: ${audioScore}%\nLevel: ${finalResult}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending test results email:", error);
  }
};

module.exports = { sendTestLinkEmail, sendTestResultsEmail };
