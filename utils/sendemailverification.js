const { createmailtransportr } = require("./createMail");

const sendverificationMail = (user) => {
  const transporter = createmailtransportr();
  
  console.log('tran done')
  const mailoptions = {
    from: `"Health Bridge" <${process.env.Email}`,
    to: user.email,
    subject: "Verify toy email",
    html: `<p> Hello ${user.username},please verify
        your email by clicking this link </p>
        <a href="facebook.com" >verify you email
        
        `,
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
