import React, { Component } from "react";

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = { answers: props.data };
  }

    renderAnswers(){
        return this.state.answers.map(answer => {
            return (
                <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                name={`qid_${this.props.question.questionId}`}
                id={`q${answer.questionId}_a${answer.answerId}`}
                value={`q${answer.questionId}_a${answer.answerId}_${answer.isCorrect}`}
                />
                <label className="form-check-label" htmlFor={`q${answer.questionId}_a${answer.answerId}`}>
                {answer.content}
                </label>
            </div>
            )
    })   
    }

  render() {
    return (
      <div className="pt-3">
          <h5>Question # {this.props.question.questionId}</h5>
          <h6>{this.props.question.content}</h6>
          {this.renderAnswers()}
          <hr />
      </div>
    );
  }
}

export default Question;
