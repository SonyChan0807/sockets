var socket = io();
var name =  getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
console.log(name);

socket.on('connect', function() {
	console.log('Connected to socket.io sever ');
	
	socket.emit('joinRoom', {
		name: name,
		room: room
	});

	//jQuery('.message').append('<P>Welcome to the chat application!</p>')
});

jQuery('.room-title').text(room);

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.message');
	var $message =jQuery('<li class="list-group-item"></li>');
	console.log('New Message:');
	console.log(message.text);
	$message.append('<P><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '<strong></P>' );
	$message.append('<p>' + message.text + '</P>');
	$messages.append($message);
});

// Handle submitting of new message

var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()	
	})

	$message.val('');
});