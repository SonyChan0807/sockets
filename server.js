var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// sends current users to  provided socket

function sendCurrentUsers (socket) {
	var info =clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return ;
	}


	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users; ' + users.join(', '),
		timestamp: moment().valueOf
	})
}


io.on('connection', function (socket) {
	console.log('user connected via sockets.io');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];
		if (typeof userData!== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'Sytem',
				text: userData.name + 'has left',
				timestamp: moment().valueOf
			});
			delete userData;
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'Sytem',
			text: req.name + 'has joined',
			timestamp: moment().valueOf
		});
	});

	socket.on('message',function (message) {
		
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
		message.timestamp = moment.utc().valueOf(); // moment().valueOf();
		//socket.broadcast.emit('message',message);
		io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'system',
		text: 'Welcome to the chat application!',
		timestamp: moment.utc().valueOf() // moment().valueOf()
	})

});

http.listen(PORT, function() {
	console.log(' Server started!');
});