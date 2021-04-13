import React from 'react'
import Answer from './Answer'

const Question = (props) => {


    return (
        <div className="my-3">
            <h6>Question #{props.questionId}</h6>
            <p>{props.content}</p>
            <hr />
        </div>
    )
}

export default Question
