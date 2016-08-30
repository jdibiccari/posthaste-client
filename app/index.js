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
			users: [],
			messages: [],
			unseen: null
		}
	},
	componentDidMount: function() {
		socket.on('init', this._initialize),
		socket.on('new msg', this._addMessage),
		socket.on('notify', this._updateUsers),
		socket.on('logout', this._logoutUser)
		socket.on('unseen messages', this._updateUnseen)
	},
	_initialize: function(data) {
		this.setState({
			messages: data.messages.reverse(),
			users: data.connections
		})
	},
	_addMessage: function(message) {
		this.setState({
    		messages: this.state.messages.concat(message)
    	})
	},
	_updateUnseen: function(id) {
		this.setState({
    		unseen: id
    	})
	},
	_updateUsers: function(users) {
		this.setState({
    		users: users
    	})
	},
	_logoutUser: function() {
		this.setState({username: ''})
	},
	_loginUser: function(user) {
		this.setState({username: user})
		socket.emit('login', user)
	},
	_sendMessage: function(message) {
		socket.emit('new msg', message)
	},
	render: function(){
		return (
			<div className='chat-container'>
				<div className='header'>
					<h1>Posthaste</h1>
				</div>
				<MessageContainer
					messages={this.state.messages}
					unseen={this.state.unseen}
					sendMessage={this._sendMessage}
					username={this.state.username} />
				<UserContainer
					users={this.state.users}
					username={this.state.username}
					loginUser={this._loginUser} />
			</div>
		)
	}
})

const MessageContainer = React.createClass({
	render: function(){
		return (
			<div className='msg-container'>
				<MessageList messages={this.props.messages} unseen={this.props.unseen}/>
				<MessageBox sendMessage={this.props.sendMessage} username={this.props.username} />
			</div>
		)
	}
})
const MessageList = React.createClass({
	componentDidUpdate: function(prevProps) {
		const node = ReactDOM.findDOMNode(this)
		if (this.props.unseen && this.props.unseen !== prevProps.unseen) {
			console.log(this.props.unseen)
			this.refs.unseen.scrollIntoView(false)
		} else {
			node.scrollTop = node.scrollHeight
		}
	},
	getDefaultProps: function() {
		return {
			username: '',
			messages: []
		}
	},
	render: function() {
		const listItems = this.props.messages.map(msg => {
			let isRef = false
			const time = dateFormat(msg.created_at, "longTime")
			if (this.props.unseen === msg._id) {
				isRef = true
			}
			return <div key={msg._id} ref={isRef? 'unseen' : null} className='chat'>
					<span className='chat-user' style={{color: msg.user.color}}>{msg.user.username}</span>
					<span className='chat-msg'>{ReactEmoji.emojify(msg.msg)}</span>
					<span className='tooltiptext'>{time}</span>
				</div>
		})
		return (
			<div className='messages'>
				{listItems}
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
		if (this.state.chat !== '') {
			this.props.sendMessage(this.state.chat)
			this.setState({ chat: '' })
		}
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

const UserContainer = React.createClass({
	render: function(){
		let child = null

		if (this.props.username) {
			child = <IdentityReminder username={this.props.username} />
		} else {
			child = <Login loginUser={this.props.loginUser} username={this.props.username} />
		}

		return (
			<div className='user-sidebar'>
				{child}
				<UserList users={this.props.users} userCount={this.props.users.length} />
			</div>
		)
	}
})

const UserList = React.createClass({
	render: function(){
		var listItems = this.props.users.map((user) => {
			return <li className='user' key={user._id}> {user.username} is on</li>
		})
		return (
			<div className='users'>
				<ul>
					{listItems}
				</ul>
				<div><span className='user-count'>{this.props.userCount}</span> user(s) connected</div>
			</div>
		)
	}
})

const IdentityReminder = React.createClass({
	render: function(){
		return (
			<div className='login-container'>
				<span> You are signed in as {this.props.username} </span>
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
