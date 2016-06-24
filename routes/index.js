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

var startLat = 60.174039;
    var startLong = 24.940939;
    var endLat = 59.337174;
    var endLong = 18.067883;
    var pointsNo = 80;
    var latDelta = (endLat - startLat) / pointsNo;
    var lngDelta = (endLong - startLong) / pointsNo;

var runUpdate = function(){
	
    for(i=0; i<2; i++) {

    	(function(i){ 
 			setTimeout(function () {
            		updateObject(i);
        			}, 20000); 
 		})(i);
     }
    
}

var updateObject = function(index){
	
	var lat = startLat + index * latDelta;
    var long = startLong + index * lngDelta;	

	console.log("Running now.... " + index);
	console.log("Lat is " + lat);
	dbUtil.query("INSERT INTO salesforce.technician__c (name, technicianlocation__latitude__s, technicianlocation__longitude__s) values($1, $2, $3)", ['amits', lat, long])
	.done(function(updateCount){
		console.log("Insert update.." + index);
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
