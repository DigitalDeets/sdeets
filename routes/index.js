var express = require('express');
var router = express.Router();
var cors = require('cors');
var email = require('./email');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'School Deets' });
});

router.post('/email', cors(), (req, res) => {
    email.send( req.body , (error) => {
        res.status( 403 ).json( error );
    },
    (response) => {
        res.status( 200 ).json( response );
    })
})
module.exports = router;
