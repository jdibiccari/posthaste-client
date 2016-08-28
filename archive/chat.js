$(function() {
	const socket = io.connect('http://localhost:3700')

	function sendMsg() {
		const msg = $('#msg-box').val()
		socket.emit('new msg', msg)
		$('#msg-box').val('')
	}

	function login() {
		const username = $('#login').val()
		socket.emit('login', username)
	}

	// Dom events
	$('#send-msg').on('click', () => {
		sendMsg()
	})

	$('#login-submit').on('click', () => {
		login()
	})

	$(document).keypress( (e) => {
		console.log($('#msg-box').val())
		if (e.which == 13) {
			$('#send-msg').trigger('click')
		}
	})

	// Socket events
	socket.on('new msg', (data, user) => {
		const tooltip = `<span class='tooltiptext'>${data.created_at}</span>`
		const li = `<li class='chat'>${tooltip}${user}: ${data.msg}</li>`
		$( "#messages").append(li)
	})

	socket.on('notify', (notification) => {
		const li = `<li class='notification'>${notification}</li>`
		$( ".users ul").append(li)
		$('.login-container').hide()
	})

	socket.on('update count', (count) => {
		$( ".user-count").text(count)
	})
})