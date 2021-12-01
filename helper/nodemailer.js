var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
const logger = require("./logger");

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    }
    else {
      callback(null, html);
    }
  });
};
module.exports = {
  //nodemailer service
  nodeMailerService: (to, subject, text, fn, ln) => {
    readHTMLFile(__dirname + '/../public/mail.html', function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        username: fn + " " + ln,
      };
      var htmlToSend = template(replacements);
      var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // use SSL
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
      var mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: htmlToSend
      };
      //send mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info( info.response);
        }
      });
    });
  }
}