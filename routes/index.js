var express = require('express');
var router = express.Router();
var twilio = require("twilio");
var dbUtil = require('../util/dbutil.js');

var accountSid = 'AC95fe367f44081f3dd847deefde865a44'; // Your Account SID from www.twilio.com/console
var authToken = '81db504afcaa33b2adfb53de52e9463a';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

var isRunning = false;

/* GET home page. */
router.get('/', function(req, res, next) {
	
	dbUtil.query("SELECT * FROM salesforce.technician__c WHERE sfid=($1)", ['a0136000006qmebAAA'], true)
	.done(function(result){
		runUpdate();
		res.send("Result " + result.technicianlocation__latitude__s);
	},
    function(error){
    	console.log(error);
    	next(error);
	});

  //res.render('index', { title: 'Express' });
});


var runUpdate = function(){
	var startLat = 37.808000;
    var startLong = -122.417743;
    var endLat = 37.759006;
    var endLong = -122.418594;
    var pointsNo = 80;
    var latDelta = (endLat - startLat) / pointsNo;
    var lngDelta = (endLong - startLong) / pointsNo;
    if(!isRunning){
    	isRunning = true;
	    for(i=0; i<80; i++) {
	    	(function(i){ 
     			lat = startLat + i * latDelta;
	        	long = startLong + i * lngDelta;
     			setTimeout(function () {
	            		updateObject(lat, long, i);
	        			}, 2000); 
     		})(i);
	     }
    }
}

var updateObject = function(lat, long, index){
	if (index == 80){
		isRunning = false;
	}

	console.log("Running now.... " + index);
	dbUtil.query("UPDATE salesforce.technician__c set technicianlocation__latitude__s=($1), technicianlocation__longitude__s=($2) WHERE sfid=($3)", [lat, long, 'a0136000006qmebAAA'])
	.done(function(updateCount){
		console.log("Completed update.." + index);
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
