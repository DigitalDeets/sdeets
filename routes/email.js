var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var swig = require('swig');
var ses = require('nodemailer-ses-transport');

var transporter = nodemailer.createTransport('SES', {
    AWSAccessKeyID: process.env.AWS_KEY,
    AWSSecretKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION 
});

module.exports = {
    send:function( options, err, cb ){
        var template = swig.compileFile(__dirname + `/../templates/${options.template}.html`);

        if(options.template == 'post_notification'){
            var html = template({
                receiverName: options.receiverName,
                senderName: options.senderName,
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
                incompleteRegistration: options.incompleteRegistration,
                prospectiveParent: options.prospectiveParent,
                unregisteredParent: options.unregisteredParent,
                adsPosts: options.adsPosts,
                sponsors: options.sponsors,
                dd_categories: options.dd_categories,
                appURL: options.appURL
            });            
        }else if(options.template == 'post_notification_student'){
            var html = template({
                receiverName: options.receiverName,
                senderName: options.senderName,
                content: options.content,
                group: options.group,
                postType: options.postType,
                subject: options.subject,
                postId: options.postId,
                studentId: options.studentId,
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
                appURL: options.appURL
            });
  
        }else if(options.template == 'promotion_notification'){
            var html = template({
                subject: options.subject,
                receiverName: options.receiverName,
                organizationName: options.organizationName,
                organizationAvatar: options.organizationAvatar,
                schoolName: options.schoolName,
                content: options.content,
                authorName: options.authorName,
                authorAvatar: options.authorAvatar,                   
                promotionDate: options.promotionDate,
                promotionImage: options.promotionImage,
                promotionAttachmentLink: options.promotionAttachmentLink,
                promotionAttachmentIcon: options.promotionAttachmentIcon,
                promotionURL: options.promotionURL,
                promotionShareURL: options.promotionShareURL,
                appURL: options.appURL,
                postId: options.postId,
                userId: options.userId,
                userType: options.userType
            });
        }else if(options.template == 'digest'){
            var html = template({                             
                postId: options.postId,
                userId: options.userId,
                userEmail: options.receiver, 
                schoolName: options.schoolName,
                schoolIcon: options.schoolIcon,
                content: options.content,  
                CTAText: options.cta_text,
                CTAUrl: options.cta_url,
                CTAButton: options.cta_button,
                appURL: options.appURL
            });

        }else if(options.template == 'account_parent_invitation'){
            var html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                userId: options.userId,
                appURL: options.appURL
            });

        }else if(options.template == 'welcome_prospective_parent'){
            var html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                content: options.content
            });
        }else if(options.template == 'influencer_invitation'){
            var html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                agreeLink: options.agreeLink
            });
        }else if(options.template == 'notification'){
            var html = template({
                headerContent: options.headerContent,
                content: options.content,
                buttonLink: options.buttonLink,
                buttonLabel: options.buttonLabel,
                buttonLink2: options.buttonLink2,
                buttonLabel2: options.buttonLabel2
            });
        }
        
        var sender_name  = process.env.SENDER_NAME;
        var sender_email = process.env.SENDER_EMAIL;
        
        //if set option sender_name and sender_email, don't use default
        if (typeof options.OrganizationSenderName !== 'undefined' && typeof options.OrganizationSenderEmail !== 'undefined'){
            if (options.OrganizationSenderName && options.OrganizationSenderEmail){
                sender_name  = options.OrganizationSenderName;
                sender_email = options.OrganizationSenderEmail;
            }
        }
        
        var sender_address  = '"' + sender_name + '" <' + sender_email + '>';
        
        var mailOptions = {
            transport:  transporter,
            from:       sender_address,
            to:         options.receiver,
            subject:    options.subject,
            html:       html
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
