import React from 'react'
import Question from './Question'

const Module = ({moduleId}) => {

    // create an API call here to get module questions and pop them into the questions constant

    const questions = [
        // Placeholder module question data
        {
        questionId: 1,
        text: "This is a question",
        options: [
            ['Option 1', true],
            ['Option 2', false],
            ['Option 3', false],
            ['Option 4', false]
        ]
    },
    {
        questionId: 2,
        text: "This is another question",
        options: [
            ['Option 1', true],
            ['Option 23', false],
            ['Option 3', false],
            ['Option 4', false]
        ]
    }]

    const renderQuestions = () => {
        return questions.map(question => {
            return <Question data={question} />
        })
    }

    return (
        <div className="container mt-3">
            <h6 className="">Module {moduleId}</h6>
            {renderQuestions()}
        </div>
    )
}

export default Module
