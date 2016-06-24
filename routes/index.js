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
	
	dbUtil.query("SELECT * FROM salesforce.technician__c WHERE sfid=($1)", ['a0136000006qlTbAAI'], true)
	.done(function(result){
		updateObject();
		res.send("Result " + result.technicianlocation__latitude__s);
	},
    function(error){
    	console.log(error);
    	next(error);
	});

  //res.render('index', { title: 'Express' });
});

var updateObject = function(){

	dbUtil.query("UPDATE salesforce.technician__c set technicianlocation__latitude__s=($1), technicianlocation__longitude__s=($2) WHERE sfid=($3)", ['12.12', '10.10', 'a0136000006qlTbAAI'])
	.done(function(updateCount){
		console.log("UPDATE COUNT IS >> " + updateCount);
	},
    function(error){
    	console.log(error);
    });
}

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
