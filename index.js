
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

// given src/target language codes, and message, 
// returns the resulting translation as in a callback
function convertMessage(srclang, targetlang, msg, callback){
	var translateoptions = {
		key: yandexAPIkey,
		lang: srclang + '-' + targetlang,
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
			process.stdout.write(data);
			console.log(''); //newline
			var decoded_data = JSON.parse(data.toString('utf8')); // decode response
			//translatedMsg = decoded_data.text[0];

			console.log(decoded_data.text);

			callback(decoded_data.text[0]);
		});
	});
}

function handleChatMessage(languageIndex, srclang, msg) {
	console.log("================================");
	// terminate if hit all languages
	if (languageIndex >= languages.length){ 
		io.emit('chat message', msg);
		return;
	}
	else{
		// get language information and key
		var destlang = languages[languageIndex];

		// send HTTPS Get request to Yandex
		convertMessage(srclang, destlang, msg, function(translatedMsg){
			return handleChatMessage(languageIndex+1, destlang, translatedMsg);	
		});
	}

}

//-------------------------- on connection ------------------------------------

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		handleChatMessage(0, "en", msg);
	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('listening on ', port);
});
