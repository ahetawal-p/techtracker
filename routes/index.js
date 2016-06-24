var express = require('express');
var router = express.Router();
var twilio = require("twilio");
var dbUtil = require('../util/dbutil.js');

var accountSid = 'AC95fe367f44081f3dd847deefde865a44'; // Your Account SID from www.twilio.com/console
var authToken = '81db504afcaa33b2adfb53de52e9463a';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);


/* GET home page. */
router.get('/', function(req, res, next) {
	
	dbUtil.query("SELECT * FROM salesforce.contact", null, false)
	.done(function(result){
		res.send("Result " + userEmail);
	},
    function(error){
    	console.log(error);
    	next(error);
	});

  //res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/sendsms', function(req, res, next) {
	console.log(req.body);
	client.messages.create({
    body: 'Hello from Salesforce',
    to: '+14156402834',  // Text this number
    from: '+16507535865' // From a valid Twilio number
	},
	function(err, message) {
    	console.log(message.sid);
    	res.send("Sent");
	});
});


module.exports = router;
