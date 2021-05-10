import React from 'react'

// Small prop to render the answer inputs for each question.

const Answer = (props) => {

  function renderAnswers() {
    return props.answers.map(answer => {
      return (
        <div className="form-check py-1" key={answer.answerId}>
        <input className="form-check-input" type="radio" name={`qid_${answer.questionId}`} id={`q${answer.questionId}_a${answer.answerId}_${answer.isCorrect}`} value="option2"/>
        <label className="form-check-label" htmlFor={`q${answer.questionId}_a${answer.answerId}_${answer.isCorrect}`}>
          {answer.content}
        </label>
      </div>
      )
    })
  }

  return (
    <div>
      {renderAnswers()}
    </div>
  )
}

export default Answer

