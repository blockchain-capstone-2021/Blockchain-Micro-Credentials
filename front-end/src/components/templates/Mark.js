import React, { Component } from "react";

class Mark extends Component {

    state = {
        name: "",
        age: 0,
      };

  onNameChange = e => {
      console.log(this.state.name);
      this.setState({name: e.target.value})

  }

  onAgeChange = e => {
      this.setState({age: e.target.value})
      console.log(this.state.age);
  }

  onFormSubmit = e => {
      e.preventDefault();
      //TODO: Make callback to function in Parent component
      this.props.onFormSubmit(this.state.name, this.state.age
      );
  }

  render() {
    return (
      <div className="example">
        <h4 className="ui header">IPFS Test</h4>
        <form className="ui form" data-np-checked="1" onSubmit={this.onFormSubmit}>
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              data-np-checked="1"
              value={this.state.name}
              onChange={this.onNameChange}
            />
          </div>
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              data-np-checked="1"
              value={this.state.age}
              onChange={this.onAgeChange}
            />
          </div>
          <div className="field"></div>
          <button className="ui button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Mark;
