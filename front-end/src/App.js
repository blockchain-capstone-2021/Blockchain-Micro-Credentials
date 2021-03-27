import React, { Component } from 'react';
import users from './apis/users';
import './App.css';

class App extends Component {
  state = {users: []}

  componentDidMount = async () => {
    const {data} = await users.get('/users')
    this.setState({users: data});
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default App;