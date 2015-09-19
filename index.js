var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// API key for yandex
var yandexAPIkey = "trnsl.1.1.20150919T183321Z.d9cbecfd657d3645.6863667a9c7e61e4ebb897d5dbc0cd50503ec027";
// API key for Big Huge Thesaurus
var bhtAPIkey = 9c260c0a82ebe7df7168908355d7b885;

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a messagemsg
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);

		// now fuck it up!
		


		io.emit('chat message', );
	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log('listening on ', port);
});