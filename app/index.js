const React = require('react')
const ReactDOM = require('react-dom')

require("./style.scss")

// Chat app
const ChatApp = React.createClass({
	getInitialState: function(){
		return {
			username: '',
			users: [],
		}
	},
	render: function(){
		return (
			<div className='chat-container'>
				<h1>Posthaste</h1>
				<MessageContainer />
				<UserContainer users={this.state.users} username={this.state.username} />
			</div>
		)
	}
})


const MessageContainer = React.createClass({
	getInitialState: function(){
		return {
			messages: ['test', 'test'],
		}
	},
	render: function(){
		return (
			<div className='msg-container'>
				<MessageList chats={this.state.messages} />
			</div>
		)
	}
})

const MessageList = React.createClass({
	render: function(){
		var listItems = this.props.chats.map(function(msg, i){
			return <li key={i} className='chat'> {msg} </li>
		})
		return (
			<ul className='messages'>
				{listItems}
			</ul>
		)
	}
})

const MessageBox = React.createClass({
	getInitialState: function(){
		return {
			chat: ''
		}
	},
	updateChat: function(e){
		this.setState({
			chat: e.target.value
		});
	},
	render: function(){
		return (
			<div className='input-container'>
				<button onClick={this.handleLogin} id='send-msg'> + </button>
				<input type='text' value={this.state.chat} placeholder='Message me' onChange={this.updateChat} />
			</div>
		)
	}
})

const UserContainer = React.createClass({
    getInitialState: function(){
      return {
        username: '',
        users: []
      }
    },
    addUser: function(username) {
    	this.setState({
    		users: this.state.users.concat(username)
    	})
    },
    render: function(){
      return (
        <div className='user-sidebar' >
        	<Login addUser={this.state.addUser} />
          	<UserList users={this.state.users} />
        </div>
      )
    }
})

const UserList = React.createClass({
	getDefaultProps: function(){
		return {
			users: []
		}
	},
	render: function(){
		var listItems = this.props.users.map(function(user){
			return <li> {user} </li>
		})
		return (
			<div className='users'>
				<ul>
					{listItems}
				</ul>
				<div><span className='user-count'></span> user(s) connected</div>
			</div>
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
	updateNewUser: function(e){
		this.setState({
			newUser: e.target.value
		});
	},
	handleLogin: function(){
		this.props.addUser(this.state.newUser)
		// Reset to none
		this.setState({
			newUser: ''
		})
	},
	render: function(){
		return (
			<div className='login-container'>
				<button onClick={this.handleLogin} id='login-submit'> + </button>
				<input type='text' value={this.state.newUser} placeholder='Enter a username' onChange={this.updateNewUser} />
			</div>
			)
	}
})

ReactDOM.render(
  <ChatApp />,
  document.getElementById('app')
)
