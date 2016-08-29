const React = require('react')
const ReactDOM = require('react-dom')
const ReactEmoji = require('react-emoji')
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
			users: [],
			messages: []
		}
	},
	componentDidMount: function() {
		socket.on('init', this._initialize),
		socket.on('new msg', this._addMessage),
		socket.on('notify', this._updateUsers),
		socket.on('update count', this._updateUserCount)
	},
	_initialize: function(data) {
		this.setState({
			userCount: data.connections.length,
			messages: data.messages.reverse(),
			users: data.connections
		})
	},
	_addMessage: function(message) {
		this.setState({
    		messages: this.state.messages.concat(message)
    	})
	},
	_updateUsers: function(users) {
		this.setState({
    		users: users
    	})
	},
	_updateUserCount: function(count) {
		this.setState({
    		userCount: count
    	})
	},
	loginUser: function(user) {
		this.setState({username: user})
		socket.emit('login', user)
	},
	sendMessage: function(message) {
		socket.emit('new msg', message)
	},
	render: function(){
		return (
			<div className='chat-container'>
				<div className='header'>
					<h1>Posthaste</h1>
				</div>
				<MessageList messages={this.state.messages} />
				<MessageBox sendMessage={this.sendMessage} username={this.state.username} />
				<UserList users={this.state.users} userCount={this.state.userCount} username={this.state.username} loginUser={this.loginUser} />
			</div>
		)
	}
})


const MessageList = React.createClass({
	componentDidUpdate: function() {
		const node = ReactDOM.findDOMNode(this)
		node.scrollTop = node.scrollHeight
	},
	getDefaultProps: function() {
		return {
			username: '',
			messages: []
		}
	},
	render: function() {
		const listItems = this.props.messages.map(msg => {
			const time = dateFormat(msg.created_at, "longTime")
			return <li key={msg._id} className='chat'>
					<span className='chat-user' style={{color: msg.user.color}}>{msg.user.username}</span>
					<span className='chat-msg'>{ReactEmoji.emojify(msg.msg)}</span>
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
	handleSubmit: function(e){
		e.preventDefault()
		this.props.sendMessage(this.state.chat)
		this.setState({ chat: '' })
	},
	render: function(){
		if (!this.props.username) {
			return null
		}
		return (
			<div className='input-container'>
				<form onSubmit={this.handleSubmit}>
					<button type='submit' id='send-msg'> + </button>
					<input type='text' value={this.state.chat} placeholder='Chat away...' onChange={this.handleChange} />
				</form>
			</div>
		)
	}
})

const UserList = React.createClass({
	render: function(){
		let child = null
		var listItems = this.props.users.map((user) => {
			return <li className='user' key={user._id}> {user.username} </li>
		})

		if (this.props.username) {
			child = <IdentityReminder username={this.props.username} />
		} else {
			child = <Login loginUser={this.props.loginUser} username={this.props.username} />
		}

		return (
			<div className='user-sidebar'>
					{child}
				<div className='users'>
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
			<div className='login-container'>
				<span> You are signed in as {this.props.username}</span>
			</div>
		)
	}
})

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
	handleSubmit: function(e){
		e.preventDefault()
		this.props.loginUser(this.state.newUser)
		this.setState({ newUser: '' })
	},
	render: function(){
		return (
			<div className='login-container'>
				<form onSubmit={this.handleSubmit}>
					<button type='submit' id='login-submit'> + </button>
					<input type='text' value={this.state.newUser} placeholder='Enter a username' onChange={this.handleChange} />
				</form>
			</div>
		)
	}
})

ReactDOM.render(
  <ChatApp />,
  document.getElementById('app')
)
