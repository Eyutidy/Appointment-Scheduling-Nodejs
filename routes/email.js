const nodemailer = require("nodemailer");

const sendEmail = async (name, email, date, time) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eyoabasegid2002@gmail.com",
        pass: "lxbimlfttziitjwg",
      },
    });

    const mailOptions = {
      from: "eyoabasegid2002@gmail.com",
      to: email,
      subject: "Appointment has been set",
      text: `Dear ${name}, your appointment has been scheduled for ${date} at ${time} please be on time Thank you OAS.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
