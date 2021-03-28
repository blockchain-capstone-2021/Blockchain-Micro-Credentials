import React, { Component } from 'react';
import marks from '../apis/marks';
import Mark from './templates/Mark';

class App extends Component {
  state = {}
  onMarkSubmit = async (name, age) => {
    await this.setState({name, age});
    const {data} = await marks.post('/', {
      name: this.state.name,
      age: this.state.age
    })
    this.setState({"url":data.url})
  }

  onGetFile = async () => {
    const {data} = await marks.get('/get', {
      params: {
        fileUrl: this.state.url
      }
    })
    this.setState({'IPFSOutput': data})
  }

  render() {
    return (
      <div className="ui container">
        <Mark onFormSubmit={this.onMarkSubmit} />
        Name: {this.state.name} <br></br>
        Age: {this.state.age} <br></br>
        URL: <a href={`https://ipfs.infura.io/ipfs/${this.state.url}`} target="_blank" rel="noreferrer">{this.state.url}</a> <br/>
        GET Data: <button className="ui button" onClick={this.onGetFile}>Get Data</button> <br/>
        <div>
          This data was read from IPFS: <br/>
          {JSON.stringify(this.state.IPFSOutput)}
        </div>
      </div>
    );
  }
}

export default App;

