const React = require('react')
const ReactDOM = require('react-dom')
const dateFormat = require('dateformat')
// Make this more easily configurable
const socket = io.connect('http://localhost:3700')

require("./style.scss")

// Chat app
const ChatApp = React.createClass({
	getInitialState: function(){
		return {
			username: '',
			userCount: 0,
			notifications: [],
			messages: []
		}
	},
	componentDidMount: function() {
		socket.on('init', this._initialize),
		socket.on('new msg', this._addMessage),
		socket.on('notify', this._updateNotifications),
		socket.on('update count', this._updateUserCount)
	},
	_initialize: function(data) {
		this.setState({
			userCount: data.connections.length,
			messages: data.messages
		})
	},
	_addMessage: function(message) {
		this.setState({
    		messages: this.state.messages.concat(message)
    	})
	},
	_updateNotifications: function(notification) {
		this.setState({
    		notifications: this.state.notifications.concat(notification)
    	})
	},
	_updateUserCount: function(count) {
		this.setState({
    		userCount: count
    	})
	},
	loginUser: function(user) {
		console.log('this should still work' + user)
		this.setState({username: user})
		socket.emit('login', user)
	},
	sendMessage: function(message) {
		socket.emit('new msg', message)
		console.log(message)
	},
	render: function(){
		return (
			<div className='chat-container'>
				<div className='header'>
					<h1>Posthaste</h1>
				</div>
				<MessageList messages={this.state.messages} />
				<MessageBox sendMessage={this.sendMessage}/>
				<NotificationList notifications={this.state.notifications} userCount={this.state.userCount} username={this.state.username} loginUser={this.loginUser} />
			</div>
		)
	}
})


const MessageList = React.createClass({
	getDefaultProps: function(){
		return {
			username: '',
			messages: []
		}
	},
	render: function(){
		const listItems = this.props.messages.map(msg => {
			const time = dateFormat(msg.created_at, "longTime")
			return <li key={msg._id} className='chat'>
					<span className='chat-user'>{msg.user.username}</span>
					<span className='chat-msg'>{msg.msg}</span>
					<span className='tooltiptext'>{time}</span>
				</li>
		})
		return (
			<div className='msg-container'>
				<ul className='messages'>
					{listItems}
				</ul>
			</div>
		)
	}
})

const MessageBox = React.createClass({
	getInitialState: function(){
		return {
			chat: ''
		}
	},
	handleChange: function(e){
		this.setState({
			chat: e.target.value
		});
	},
	handleSubmit: function(){
		this.props.sendMessage(this.state.chat)
		this.setState({ chat: '' })
	},
	render: function(){
		return (
			<div className='input-container'>
				<button onClick={this.handleSubmit} id='send-msg'> + </button>
				<input type='text' value={this.state.chat} placeholder='Start chatting' onChange={this.handleChange} />
			</div>
		)
	}
})

const NotificationList = React.createClass({
	render: function(){
		let child = null
		var listItems = this.props.notifications.map((notification, i) => {
			return <li className='notification' key={i}> {notification} </li>
		})

		if (this.props.username) {
			child = <IdentityReminder username={this.props.username} />
		} else {
			child = <Login loginUser={this.props.loginUser} username={this.props.username} />
		}

		return (
			<div className='user-sidebar'>
				{child}
				<div className='notifications'>
					<ul>
						{listItems}
					</ul>
					<div><span className='user-count'>{this.props.userCount}</span> user(s) connected</div>
				</div>
			</div>
		)
	}
})

const IdentityReminder = React.createClass({
	render: function(){
		return (
			<span>
				You are signed in as {this.props.username}
			</span>
		)
	}
})

// Username component
const Login = React.createClass({
	getInitialState: function(){
		return {
			newUser: ''
		}
	},
	handleChange: function(e){
		this.setState({
			newUser: e.target.value
		})
	},
	handleSubmit: function(){
		console.log('submit')
		this.props.loginUser(this.state.newUser)
		this.setState({ newUser: '' })
	},
	render: function(){
		return (
			<div className='login-container'>
				<button onClick={this.handleSubmit} id='login-submit'> + </button>
				<input type='text' value={this.state.newUser} placeholder='Enter a username' onChange={this.handleChange} />
			</div>
		)
	}
})

ReactDOM.render(
  <ChatApp />,
  document.getElementById('app')
)
