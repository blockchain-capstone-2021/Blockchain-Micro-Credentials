import React from 'react'
import Answer from './Answer'

const Question = (props) => {
    const renderAnswers = () => {
        return props.data.options.map(answer => {
            console.log(props);
            return <Answer text={answer[0]} correct={answer[1]} />
        })
    }

    return (
        <div className="my-3">
            <h6>Question #{props.data.questionId}</h6>
            <p>{props.data.text}</p>
            {renderAnswers()}
            <hr />
        </div>
    )
}

export default Question
