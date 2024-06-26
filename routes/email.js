var nodemailer = require("nodemailer");
var swig = require('swig');

var transporter = nodemailer.createTransport('SES', {
    AWSAccessKeyID: process.env.AWS_KEY,
    AWSSecretKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION 
});

module.exports = {
    send:function( options, err, cb ){
        var template = swig.compileFile(__dirname + `/../templates/${options.template}.html`);
        var html = '';
        
        if(options.template == 'post_notification'){
            html = template({
                receiverName: options.receiverName,
                senderName: options.senderName,
                content: options.content,
                postType: options.postType,
                subject: options.subject,
                postId: options.postId,
                userId: options.userId,
                userEmail: options.receiver,
                postUrl: options.postUrl,
                groups: options.groups,
                organizationIcon: options.organizationIcon,
                organizationName: options.organizationName,
                organizationAddress: options.organizationAddress,
                organizationBrand: options.organizationBrand,
                organizationSponsorFlyer: options.organizationSponsorFlyer,
                organizationType: options.organizationType,
                authorAvatar: options.authorAvatar,                   
                postDate: options.postDate,
                postImage: options.postImage,
                postImages: options.postImages,
                templateWidth: options.templateWidth,
                postVideoLink: options.postVideoLink,
                postVideoIcon: options.postVideoIcon,
                postAttachmentLink: options.postAttachmentLink,
                postAttachmentIcon: options.postAttachmentIcon,
                DDnotification: options.DDnotification,
                incompleteRegistration: options.incompleteRegistration,
                prospectiveParent: options.prospectiveParent,
                promotions: options.promotions,
                featuredSponsor: options.featuredSponsor,
                promotionIDs: options.promotionIDs,
                socialMedia: options.socialMedia,
                appURL: options.appURL,
                buttonTitle: options.buttonTitle,
                buttonURL: options.buttonURL
            }); 
        
        }else if(options.template == 'digest'){
            html = template({                             
                postId: options.postId,
                userId: options.userId,
                userEmail: options.receiver, 
                organizationID: options.organizationID,
                organizationName: options.organizationName,
                organizationIcon: options.organizationIcon,
                organizationBrand: options.organizationBrand,
                description: options.description,
                content: options.content,
                footer_content: options.footer_content,
                templateVersion: options.templateVersion,
                promotionIDs: options.promotionIDs,
                appURL: options.appURL
            });
            
        }else if(options.template == 'promotion_notification'){
            html = template({
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

        }else if(options.template == 'account_parent_invitation'){
            html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                userId: options.userId,
                appURL: options.appURL
            });

        }else if(options.template == 'welcome_prospective_parent'){
            html = template({
                receiverName: options.receiverName,
                schoolName: options.schoolName,
                content: options.content
            });
        }else if(options.template == 'notification'){
            html = template({
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
        
        if(options.attachment != undefined){
            mailOptions.attachments =  [{
                fileName: options.attachment.name,
                filePath: options.attachment.url
            }];
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
