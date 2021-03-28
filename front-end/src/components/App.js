import React, { Component } from 'react';
import users from '../apis/users';
import Mark from './templates/Mark';

class App extends Component {
  state = {users: [], name:"", age: 0}

  componentDidMount = async () => {
    const {data} = await users.get('/users')
    this.setState({users: data});
  }

  onMarkSubmit = (name, age) => {
    this.setState({name: name, age:age});
  }

  render() {
    return (
      <div className="ui container">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
        <Mark onFormSubmit={this.onMarkSubmit} />
        Name: {this.state.name} <br></br>
        Age: {this.state.age}
      </div>
    );
  }
}

export default App;

