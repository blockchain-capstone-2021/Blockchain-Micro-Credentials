import React, { useState, useEffect } from 'react'
import microcredapi from '../../apis/microcredapi'
import '../../style.css'

const ViewAttempt = (props) => {
    // Set state variables for the component
    const [questions, setQuestions] = useState();
    const [score, setScore] = useState();

    useEffect(() => {
        async function getAttempt() {
            if(props.match.params.attemptNo=="highest"){
                await microcredapi
                .get(`/module/attempt/${props.match.params.studentId}/${props.match.params.courseId}/${props.match.params.moduleId}`)
                    .then(response => {
                        updateQuestions(response.data.questions, response.data.answersMap, response.data.providedAnswerMap, response.data.score)
                    })
            }else{
                await microcredapi
                    .get(`/module/attempt/${props.match.params.studentId}/${props.match.params.courseId}/${props.match.params.moduleId}/${props.match.params.attemptNo}`)
                    .then(response => {
                        updateQuestions(response.data.questions, response.data.answersMap, response.data.providedAnswerMap, response.data.score)
                    })
            }
        }
        function updateQuestions(questions, answersMap, providedAnswerMap, score) {
            const updatedQuestions = []
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                const answers = answersMap[parseInt(question.questionId)]
                question.answers = answers
                const providedAnswer = providedAnswerMap[parseInt(question.questionId)]
                question.providedAnswer = providedAnswer
                updatedQuestions.push(question)
            }
            setQuestions(updatedQuestions)

            console.log(questions);
            
            console.log(score);

            setScore(score);
        }
        getAttempt()
    }, [])

    function renderQuestions(){
        if(questions){
            return questions.map((question, key) => {
                return (
                    <div className="py-3 border-top" key={question.questionId}>
                            <h6>Question {key+1}: {question.content}</h6>
                            {question.answers ? renderAnswers(question) : 'Loading...'}
                    </div>
                )
            })
        }
    }

    function renderAnswers(question) {
        return question.answers.map(answer => {
          return (
            <div class={checkCorrectAnswer(question, answer)} role="alert">
                <div className="form-check py-1" key={answer.answerId}>
                    <input className="form-check-input" type="radio" checked={checkProvidedAnswer(question, answer)} disabled={!checkProvidedAnswer(question, answer)}/>
                    {answer.content}
                </div>
            </div>
          )
        })
    }

    function checkCorrectAnswer(question, answer){
        var correctAnswer

        question.answers.map(answer => {
            if(answer.isCorrect){
                correctAnswer = parseInt(answer.answerId)
            }
        })

        var alert = "alert alert-light"
        if(answer.answerId == correctAnswer){
            alert = "alert alert-success"
        }else if(answer.answerId == question.providedAnswer){
            alert = "alert alert-danger"
        }

        return alert

    }

    function checkProvidedAnswer(question, answer){
        var checked = false
        if(answer.answerId == question.providedAnswer){
            checked = true
        }
        return checked
    }

    function renderScore(){
        if(score!=undefined && questions[0]){
            return(
                <div> 
                    <h5>Score: {score}/{questions.length}</h5>
                    {console.log("Score: ",score)}
                    {console.log("Questions length: ",questions.length)}
                </div>
            );
        }
    }

    // Render the page elements 
    return (
      
        <div className="jumbotron align-center">
            <section>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h1">View Attempt</h1>
                </div>
                <div className="mt-4">
                    <h5>Course: {props.match.params.courseId}</h5>
                    <h5>Student: {props.match.params.studentId}</h5>
                    {renderScore()}
                </div>
                <div className="mt-4">
                    <div className="col-sm-12">
                        {questions ? renderQuestions() : 'Loading...'}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ViewAttempt
