import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import Answer from './Answer'


const Module = (props) => {

    const [questions, setQuestions] = useState()
    const history = useHistory()

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

    async function submitModule(e) {
        e.preventDefault()
        const payload = generateModuleSubmissionPayload();
        await microcredapi.post('/module/submit', payload).then(response => {
        history.push(`/unit/${window.localStorage.getItem('unitId')}`)
        })
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
        console.log(payload);
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
        <div>
            <h1>Module {props.match.params.moduleId} Quiz</h1>
            <h4>Attempt: #X</h4>
            <form>
                {questions ? renderQuestions() : 'Loading'}
                <button type="submit" className="btn btn-primary" onClick={questions ? (e) => {submitModule(e)} : ""}>Submit</button>
            </form>
        </div>
    )
}

export default Module

