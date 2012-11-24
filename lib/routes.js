/**
 * @author Admin
 */
var config = require('./config.js');

module.exports = function (app) {

app.get('/', function(req,res) {
	res.render('index.html');
});	

app.get('/entertainment', function(req, res) {
	res.send(config.entertainment);
});

app.post('/userEntertainmentData', function(req, res) {
	var userdata = req.body.userdata;
	console.log('response is ' + userdata.toString());
});



}