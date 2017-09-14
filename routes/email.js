var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var swig = require('swig');
var ses = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport('SES', {
    AWSAccessKeyID: process.env.AWS_KEY,
    AWSSecretKey: process.env.AWS_SECRET,
    SeviceUrl:"https://email.us-west-1.amazonaws.com"
});


module.exports = {

    
    send:function( options, err, cb ){
          var template = swig.compileFile(__dirname + `/../templates/${options.template}.html`);

          var html = template({
            //schoolLogo: options.emailOptions.logo,
            //groupIcon: options.emailOptions.icon,
            receiverName: options.receiverName,
            senderName: options.senderName,
            content: options.content,
            group: options.group,
            postId: options.postId,
            userId: options.userId,
            postUrl: options.postUrl
            //profilePic: options.emailOptions.profilePic
        });

          var mailOptions = {
            transport: transporter,
            from: 'no-reply@schooldeets.com', // sender address
            to: options.receiver, // list of receivers
            subject: options.subject, // Subject line
            html: html
        };

        // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('we got an error: ' + error);
            err(error);

        } else {
            var tt = new Date().getTime()
            console.log('email sent to ' + mailOptions.to + ' at ' + new Date(tt));

            cb({success: true});

        }
    });


    }
}