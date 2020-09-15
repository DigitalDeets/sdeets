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

        if(options.template == 'post_notification'){
            var html = template({
                receiverName: options.receiverName,
                senderName: options.senderName,
                senderPosition: options.senderPosition,
                content: options.content,
                group: options.group,
                postType: options.postType,
                subject: options.subject,
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
                postVideoLink: options.postVideoLink,
                postVideoIcon: options.postVideoIcon,
                postAttachmentLink: options.postAttachmentLink,
                postAttachmentIcon: options.postAttachmentIcon,
                truncateText: options.truncateText,
                incompleteRegistration: options.incompleteRegistration,
                prospectiveParent: options.prospectiveParent,
                unregisteredParent: options.unregisteredParent,
                adsPosts: options.adsPosts,
                dataImportPreference: options.dataImportPreference
            });

        }else if(options.template == 'account_parent_invitation'){
            var html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                userId: options.userId
            });

        }else if(options.template == 'welcome_prospective_parent'){
            var html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                content: options.content
            });
        }

        var mailOptions = {
            transport: transporter,
            from: 'School Deets <no-reply@schooldeets.com>', // sender address
            to: options.receiver, // list of receivers
            subject: options.subject, // Subject line
            html: html
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('sendMail error: ', error);
                err(error);
            } else {
                var tt = new Date().getTime()

                var info_msg = 'email sent to ' + mailOptions.to + ' at ' + new Date(tt);

                var messageId  = '';
                if (typeof info.messageId !== 'undefined'){
                    messageId = info.messageId;
                    info_msg += ' ' + info.messageId 
                }
                
                console.log(info_msg);

                cb({success: true, messageId: messageId});
            }
        });
    }
}
