import React, { useEffect, useState } from 'react'
import microcredapi from '../../apis/microcredapi'
import { Link } from 'react-router-dom'
const StaffQuestionView = (props) => {

    const [question, setQuestion] = useState()

    useEffect(() => {
        async function getQuestion() {
            return await microcredapi.get(`/questions/${props.match.params.questionId}`).then(response => {
                let question = response.data.question
                const answers = microcredapi.post(`/questions/${props.match.params.questionId}/answers`).then(res => {
                    question.answers = res.data.answers
                    setQuestion(question)
                })
                
            })
        }
        getQuestion()
    }, [])

    function renderAnswerView(answer) {
        return (
          <div className="row g-3 py-2">
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id={`answer-${answer.answerId}`}
              name={`answer-${answer.answerId}`}
              value={answer.content}
              disabled
            />
          </div>
          <div className="col-sm-2">
          <input
              type="text"
              className="form-control"
              id={`answer-${answer.answerId}`}
              name={`answer-${answer.answerId}`}
              value={answer.isCorrect === true ? 'TRUE' : 'FALSE'}
              disabled
            />
          </div>
        </div>
        )
    }

    function renderAnswers() {
        return question.answers.map(answer => {
            return renderAnswerView(answer)
        })
    }
    function renderQuestionData(){
        return (
            <div>
                {
                    question?
                    <div>
                        <h1>Question {question.questionId}</h1>
                        <form>
                        <div class="form-group py-3">
                            <label for="qid">Question ID</label>
                            <input type="text" class="form-control" id="qid"  value={question.questionId} disabled/>
                        </div>
                        <div class="form-group py-3">
                            <label for="mid">Module ID</label>
                            <input type="text" class="form-control" id="mid"  value={question.moduleId} disabled/>
                        </div>
                        <div class="form-group py-3">
                            <label for="content">Content</label>
                            <input type="text" class="form-control" id="content"  value={question.content} disabled/>
                        </div>
                        <div className="py-3">
                            <h6>Answers</h6>
                            {question.answers ? renderAnswers() : "Loading"}
                        </div>
                        </form>
                        <div className="d-flex">
                            <Link to='/manage/questions' class="btn btn-primary align-button-right">Back</Link>
                        </div>
                        </div>:
                  "Loading"
                }
            </div>
        )
    }

    return (
        <div>
            {renderQuestionData()}
        </div>
    )
}

export default StaffQuestionView
