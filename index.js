var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// API key for google translate
var googleAPIkey = "AIzaSyBedjB_f7Wyq_WQ8W3RZ0UsC36cLp9R0Os";

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// receive a message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);

		// now fuck it up!
		


		io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});


var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log('listening on ', port);
});