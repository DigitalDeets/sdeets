var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var swig = require('swig');
//var plainTemplate = swig.compileFile(__dirname + '/../templates/bugreply.txt');


var transporter = nodemailer.createTransport("SMTP",{
    service: 'gmail',
    auth: {
    XOAuth2: {
      user: process.env.GMAIL_UN, // Your gmail address.
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
  }
});

module.exports = {

    
    send:function( options, err, cb ){
          var template = swig.compileFile(__dirname + `/../templates/${options.template}.html`);

          var html = template({
            schoolLogo: options.emailOptions.logo,
            groupIcon: options.emailOptions.icon,
            receiverName: options.emailOptions.receiverName,
            senderName: options.emailOptions.senderName,
            content: options.emailOptions.content,
            profilePic: options.emailOptions.profilePic
        });

          var mailOptions = {

            from: options.sender, // sender address
            to: options.receiver, // list of receivers
            subject: options.subject, // Subject line
            html: html
        };

        // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('we got an error' + error);
            err(error);

        } else {
            console.log('email sent');
            cb('hi');

        }
        transporter.close();
    });


    }
}