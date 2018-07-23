var express = require('express');
var router = express.Router();
var cors = require('cors');
var email = require('./email');
var franc = require('franc');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/androidlink', cors(), (req, res) => {
    var androidLinks = ['asbury.dpsk12.org'];
    res.json({result: androidLinks});
})

router.get('/appversion', cors(), (req, res) => {
    var version = {
        ios: '1.5.1',
        android: '1.5.1'
    }
    res.json({result: version});
})

router.post('/detect', cors(), function(req,res){
  var detectedLanguage = franc(req.body.languageString, {'minLength': 3});

  res.json(detectedLanguage);
});

router.post('/email', cors(), (req, res) => {

    //params
    //template, icon, logo, sender (name of sender), receiver(email), subject, content, receiverName, senderName, profilePic

    email.send( req.body , (error) => {

        res.status( 403 ).json( error );

    },
    (response) => {
        res.status( 200 ).json( response );

    })
})
module.exports = router;
