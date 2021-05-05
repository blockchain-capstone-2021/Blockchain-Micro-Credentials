import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import Answer from './Answer'


const Module = (props) => {

    // State variables
    const [questions, setQuestions] = useState()
    const [submitting, setSubmitting] = useState(false)
    const history = useHistory()

    // API call to get questions and answers for the module quiz
    useEffect(() => {
        window.localStorage.setItem('moduleId', props.match.params.moduleId)
        async function getQuestionsAndAnswers() {
            const { moduleId } = props.match.params
            await microcredapi.get(`/module/${moduleId}/questions`).then(response => {
                const updatedQuestions = []
                for (let index = 0; index < response.data.questions.length; index++) {
                    const question = response.data.questions[index];
                    const answer = response.data.answersMap[parseInt(question.questionId)]
                    question.answers = answer
                    updatedQuestions.push(question)
                }
                setQuestions(updatedQuestions)
            })
            
        }
        getQuestionsAndAnswers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Displays the questions in the quiz
    function renderQuestions() {
        return questions.map((question, key) => {
            return (
                <div className="py-3 border-bottom" key={question.questionId}>
                    <h6>#{key+1}: {question.content}</h6>
                    {question.answers ? <Answer answers={question.answers} /> : 'Loading'}
                </div>
            )
        })
    }

    // Submites the module once user has click the submit button
    async function submitModule(e) {
        e.preventDefault()
        setSubmitting(true)
        const payload = generateModuleSubmissionPayload();
        await microcredapi.post('/module/submit', payload).then(response => {
        history.push(`/unit/${window.localStorage.getItem('unitId')}`)
        })
        setSubmitting(false)
    }
    
    
    function generateModuleSubmissionPayload(e) {
        const qa_pair = generateQAPair(e)
        const payload = {
            'unitId': window.localStorage.getItem('unitId'),
            'moduleId':window.localStorage.getItem('moduleId'),
            'studentId': window.localStorage.getItem('userId'),
            'enrolmentPeriod': window.localStorage.getItem('enrolmentPeriod'),
            'attemptNo': props.location.attemptNumber+1,
            'qAPairs': qa_pair
        }
        return payload;
    }

    function generateQAPair(e) {
        const qa_pair_list = []
        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];
            const qa_pair = document.getElementsByName(`qid_${question.questionId}`)
            for (let index = 0; index < qa_pair.length; index++) {
                const element = qa_pair[index];
                if (element.checked) {
                    qa_pair_list.push(element.id)
                }
            }
        }
        return qa_pair_list
    }

    return (
        <div className="row justify-content-center">
            {
                submitting?
                "Please hold while the quiz is processing.":
                <form className="w-75">
                <h1>Module {props.match.params.moduleId} Quiz</h1>
                <h4>Attempt: #{props.location.attemptNumber+1}</h4>
                {questions ? renderQuestions() : 'Loading'}
                <button type="submit" className="btn btn-primary py-3" onClick={questions ? (e) => {submitModule(e)} : ""}>Submit</button>
            </form>
            }
        </div>
    )
}

export default Module

