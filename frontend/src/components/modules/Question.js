import React, { Component } from "react";

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = { answers: props.data };
  }

    renderAnswers(){
        return this.state.answers.map(answer => {
            return (
                <div class="form-check">
                <input
                class="form-check-input"
                type="radio"
                name={`quiz-${this.props.question.questionId}`}
                id={`q${answer.questionId}_a${answer.answerId}`}
                value={answer.isCorrect}
                />
                <label class="form-check-label" for={`q${answer.questionId}_a${answer.answerId}`}>
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
