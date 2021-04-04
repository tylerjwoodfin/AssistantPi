const http = require('http');
const express = require('express');
const spawn = require("child_process").exec;

const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const router = express.Router();

const GoogleHome = require("google-home-push");

// Pass the name or IP address of your device
const myHome = new GoogleHome("192.168.1.225");

myHome.speak("Hello Tyler!");

function runServer() {
	app.set('view engine', 'ejs');

	router.get('/', function(req, res) {
		console.log(JSON.stringify(req.query));

		if(req.query.say) {
			myHome.speak(req.query.say);
		}
		
		if(req.query.email) {
			spawn(`python3 ~/Git/Tools/mail.py "${encodeURIComponent('TestSubject')}" "${encodeURIComponent(req.query.email)}"`, (err, stdout, stderr) => {
				if (err) {
					//some err occurred
					console.error(err)
				} else {
					console.log(`${stdout}`);
				}
			});
		}
	
		res.end("Enter something for me to say!");
	});

	// make the app listen for routes
	app.use('/', router);
	app.listen(process.env.port || 3000);

	console.log('Running at Port 3000');

	// res.end("Hello World");
}

function escapeQuotes(str) {
	return str.replace(/"/g, '\\\"').replace(/'/g, '\\\'');
}

setTimeout(runServer,3000);