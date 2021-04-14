import React, { Component } from 'react'
import Answer from './Answer'
import api from '../../apis/api'


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {}
      }

      componentDidMount() {
          this.renderAnswers()
      }
    
      renderAnswers = async () => {
        const response = await api.get(
          `/questions/1/answers`
        )
        console.log(response.data);
        this.setState({
          answers: response.data.answers.map((answers, key) => {
            return (
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios1"
                  value="option1"
                />
                <label class="form-check-label" for="exampleRadios1">
                  s
                </label>
              </div>
            );
          }),
        });
      };

    render() {
        return (
            <div className="my-3">
            <h6>Question #{this.props.questionId}</h6>
            <p>{this.props.content}</p>
            <hr />
        </div>
        )
    }
}


export default Question

