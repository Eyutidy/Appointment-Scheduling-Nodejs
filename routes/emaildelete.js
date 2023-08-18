const nodemailer = require("nodemailer");

const sendEmaildel = async (name, email, date, time) => {
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
      subject: "Appointment has been canceled",
      text: `Dear ${name}, your appointment has been canceled of ${date} at ${time} please make another Appointment if you want, Thank you OAS.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmaildel;
