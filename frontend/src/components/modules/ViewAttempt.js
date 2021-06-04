import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'
import { v4 as uuidv4 } from 'uuid';
import '../../style.css'

const ViewAttempt = (props) => {
    // Set state variables for the component
    const [questions, setQuestions] = useState();
    const [answersMap, setAnswers] = useState();
    const [providedAnswerMap, setProvidedAnswers] = useState();
    const [score, setScore] = useState();
    

    useEffect(() => {
        async function getAttempt() {
            if(props.match.params.attemptNo=="highest"){
                await microcredapi
                .get(`/module/attempt/${props.match.params.studentId}/${props.match.params.courseId}/${props.match.params.moduleId}`)
                    .then(response => {
                        console.log(response.data.questions);
                        console.log(response.data.answersMap);
                        console.log(response.data.providedAnswerMap);
                        console.log(response.data.score);

                        setQuestions(response.data.questions);
                        setAnswers(response.data.answersMap);
                        setProvidedAnswers(response.data.providedAnswerMap);
                        setScore(response.data.score);
                    })
            }else{
                await microcredapi
                    .get(`/module/attempt/${props.match.params.studentId}/${props.match.params.courseId}/${props.match.params.moduleId}/${props.match.params.attemptNo}`)
                    .then(response => {
                        console.log(response.data.questions);
                        console.log(response.data.answersMap);
                        console.log(response.data.providedAnswerMap);
                        console.log(response.data.score);

                        setQuestions(response.data.questions);
                        setAnswers(response.data.answersMap);
                        setProvidedAnswers(response.data.providedAnswerMap);
                        setScore(response.data.score);
                    })
            }
        }
        getAttempt()
    }, [])

    // Render the page elements 
    return (
      
      <div className="jumbotron align-center">
         <section>
           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h1">View Attempt</h1>
           </div>
           
         </section>
      </div>
    )
}

export default ViewAttempt
