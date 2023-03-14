const nodemailer = require("nodemailer");
const createmailtransportr = async (mailOption ) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: `${process.env.Email}`,
        pass: `${process.env.password}`,
      },
    });
  
    await transporter.sendMail(mailOption);
    return ({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    return ({ message:error });
  }
};
module.exports = createmailtransportr;
