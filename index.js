var app = require('express')();
var https = require('https');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var querystring = require('querystring');

// API key for translate
var yandexAPIkey = "trnsl.1.1.20150919T183321Z.d9cbecfd657d3645.6863667a9c7e61e4ebb897d5dbc0cd50503ec027";


app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);

		// now fuck it up! ==============================
		var srclang = "en";
		var destlang = "fr";
		var translateoptions = {
			key: yandexAPIkey,
			lang: srclang + '-' + destlang,
			text: [msg] // pass in an array of the original untranslated message
		};

		// build request URL
		var requestURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?" + querystring.stringify(translateoptions);
		console.log("request url: " + requestURL);

		// send HTTPS Get request to Yandex
		console.log('sending request to yandex');
		https.get(requestURL, function(response){
			console.log('response received');

			// response comes in a binary stream
			response.on('data', function(data){
				var decoded_data = JSON.parse(data.toString('utf8')); // decode response
				console.log(decoded_data.text);

				io.emit('chat message', decoded_data.text[0]); // emit translation to all users
			});
		});

	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('listening on ', port);
});