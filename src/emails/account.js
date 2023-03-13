const sgMail = require('@sendgrid/mail');

// const sendGridAPIKey = '';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rajanp1704@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the Task Manager App, ${name}. Let me know how you get along with the app.`,
  });
};
const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rajanp1704@gmail.com',
    subject: 'Thanks for using Task Manager App!',
    text: `We are sorry to hear you cancelled your account, ${name}. Help us build a better app by telling us why you left.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
