var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var querystring = require('querystring');

// API key for google translate
var googleAPIkey = "AIzaSyBedjB_f7Wyq_WQ8W3RZ0UsC36cLp9R0Os";
// request uri
var reqURI = "https://www.googleapis.com/language/translate/v2?";

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);

		// now fuck it up!
		var testorig = "hello world";
		var srclang = "en";
		var destlang = "fr";
		var options = {
			key: googleAPIkey,
			source: srclang,
			target: destlang,
			q: msg
		};

		http.get(reqURI + querystring.stringify(options), function(response){
			console.log('translation: ', response);
			io.emit('chat message', response);
		});


		//io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log('listening on ', port);
});