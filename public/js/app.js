var socket = io();
//var moment = require('moment');

socket.on('connect', function() {
	console.log('Connected to socket.io sever ');
	//jQuery('.message').append('<P>Welcome to the chat application!</p>')
});

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	console.log('New Message:');
	console.log(message.text);
	jQuery('.message').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + '<strong>' + ' - ' + message.text + '</P>');
});

// Handle submitting of new message

var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	})

	$message.val('');
});