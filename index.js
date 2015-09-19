
//-------------------------- constants ------------------------------------

var app = require('express')();
var https = require('https');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var querystring = require('querystring');
var languages = ["fr", "de", "ja", "ar", "ru", "en"];

// API key for translate
var yandexAPIkey = "trnsl.1.1.20150919T183321Z.d9cbecfd657d3645.6863667a9c7e61e4ebb897d5dbc0cd50503ec027";

//----------------------- useful functions ------------------------------------


app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

function handleChatMessage(languageIndex, srclang, msg, callbackfunc) {
	console.log("================================");
	// terminate if hit all languages
	if (languageIndex >= languages.length){ 
		console.log("hit terminal condition");
		//io.emit('chat message', msg);
		callbackfunc(msg);
		return msg; 
	}
	// get language information and key
	var destlang = languages[languageIndex];
	var translateoptions = {
			key: yandexAPIkey,
			lang: srclang + '-' + destlang,
			text: [msg] // pass in an array of the original untranslated message
		};

	// build request URL
	var requestURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?" 
		+ querystring.stringify(translateoptions);
	console.log("request url: " + requestURL);

	// send HTTPS Get request to Yandex
	var translatedMsg;
	console.log('sending request to yandex');
	https.get(requestURL, function(response){
		console.log('response received');
		// response comes in a binary stream
		response.on('data', function(data){
			process.stdout.write(data);
			var decoded_data = JSON.parse(data.toString('utf8')); // decode response
			console.log("== " + decoded_data + " DECODED DATA");			
			translatedMsg = decoded_data.text[0];
			console.log("== " + translatedMsg + " DECODED DATA");

			console.log(decoded_data.text);
			// recursive call
			return handleChatMessage(languageIndex+1, destlang, translatedMsg, callbackfunc);
		});
	});

}

//-------------------------- on connection ------------------------------------

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		handleChatMessage(0, "en", msg, 
			function (emitMessedUpMessage) {
				console.log('~~~~~~~~inside callback');
				io.emit('chat message', emitMessedUpMessage);
				return;
			});
		// send the messed up message to all users
		//io.emit('chat message', messedUpMessage);
		io.emit('chat message', "THIS IS A TEST MESSAGE");
		console.log(decoded_data.text);	
	});
	console.log('READY TO DISCONNECT');
	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('listening on ', port);
});
