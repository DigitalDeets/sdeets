var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var swig = require('swig');
var ses = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport('SES', {
    AWSAccessKeyID: process.env.AWS_KEY,
    AWSSecretKey: process.env.AWS_SECRET,
    region: 'us-west-2' 
});

module.exports = {
    send:function( options, err, cb ){
          var template = swig.compileFile(__dirname + `/../templates/${options.template}.html`);
          
          var sender_addres = '<no-reply@schooldeets.com>';
          
          if(options.template == 'post_notification'){
            var html = template({
                receiverName: options.receiverName,
                senderName: options.senderName,
                senderPosition: options.senderPosition,
                content: options.content,
                group: options.group,
                postType: options.postType,
                postId: options.postId,
                userId: options.userId,
                userEmail: options.receiver,
                postUrl: options.postUrl,
                groups: options.groups,
                schoolIcon: options.schoolIcon,
                schoolName: options.schoolName,
                authorAvatar: options.authorAvatar,
                posterName: options.posterName,                    
                postDate: options.postDate,
                postImage: options.postImage,
                truncateText: options.truncateText,
                incompleteRegistration: options.incompleteRegistration,
                adsPosts: options.adsPosts
          });
          
          sender_addres = options.schoolName + ' ' + sender_addres;
        
         }else if(options.template == 'post'){
           var html = template({
              receiverName: options.receiverName,
              senderName: options.senderName,
              content: options.content,
              group: options.group,
              postType: options.postType,
              postId: options.postId,
              userId: options.userId,
              postUrl: options.postUrl
          });
         }

          var mailOptions = {
            transport: transporter,
            from: sender_addres, // sender address
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
