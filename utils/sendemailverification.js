const { createmailtransportr } = require("./createMail");
const ejs = require("ejs");
const sendverificationMail = async (user) => {
  const transporter = createmailtransportr();
  const context = {
    username: user.username,
    firstname: user.firstname,
    token: user.emailtoken,
  };
  const template = ejs.renderFile(
    process.cwd() + "/views/email_template/index.html",
    context

    //emailtoken:user.emailtoken
  );
  const mailoptions = {
    from: `"Health Bridge" <${process.env.Email}`,
    to: user.email,
    subject: "Verify your email",
    html: await template,
    // url must be changed
  };
  transporter.sendMail(mailoptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("verification email sent");
    }
  });
};

module.exports = { sendverificationMail };
