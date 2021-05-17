import React, { useEffect, useState } from 'react'
import microcredapi from '../../apis/microcredapi'
import { Link } from 'react-router-dom'
import '../../style.css'

const StaffQuestionView = (props) => {

    // State variables
    const [question, setQuestion] = useState()
    const [hasAnswers, setHasAnswers] = useState(false)

    // Get question data from previous page
    useEffect(() => {
        setQuestion({...props.location.state.question})
    }, [])

    // API call to get answers
    useEffect(() => {
        async function getAnswers() {
            let updatedQuestion;
            await microcredapi.get(`/questions/${props.match.params.questionId}/answers`).then(res => {
                updatedQuestion = {...question, answers : res.data.answers}
            })  
            setQuestion(updatedQuestion);
            setHasAnswers(true)
        }
        if(!hasAnswers){
            getAnswers()
        }
    },[question])

    // Render Answer and true/false pair
    function renderAnswerView(answer, key) {
        const trueAnswer = key === 0 ? 'TRUE' : "FALSE"
        return (
          <div className="row g-3 py-2" key={key}>
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
              value={trueAnswer}
              disabled
            />
          </div>
        </div>
        )
    }

    // Render the answers on the page
    function renderAnswers() {
        return question.answers.map((answer, key) => {
            return renderAnswerView(answer, key)
        })
    }

    // Render the question data
    function renderQuestionData(){
        return (
            <div className="align-center">
                    <div>
                        <h1>Question Details</h1>
                        <form>
                        <div className="form-group py-3">
                            <label htmlFor="qid">Question ID</label>
                            <input type="text" className="form-control" id="qid"  value={question.questionId} disabled/>
                        </div>
                        <div className="form-group py-3">
                            <label htmlFor="mid">Module ID</label>
                            <input type="text" className="form-control" id="mid"  value={question.moduleId} disabled/>
                        </div>
                        <div className="form-group py-3">
                            <label htmlFor="content">Content</label>
                            <input type="text" className="form-control" id="content"  value={question.content} disabled/>
                        </div>
                        <div className="py-3">
                            <h6>Answers</h6>
                            {question.answers ? renderAnswers() : "Loading"}
                        </div>
                        </form>
                        <div className="d-flex">
                            <Link to='/manage/questions' className="btn btn-primary align-button-right">Back</Link>
                        </div>
                        </div>
            </div>
        )
    }

    return (
        <div>
            {question && question.answers ? renderQuestionData() : "Loading"}
        </div>
    )
}

export default StaffQuestionView
