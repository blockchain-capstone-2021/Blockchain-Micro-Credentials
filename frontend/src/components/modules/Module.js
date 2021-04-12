import React, {useState} from 'react'
import Question from './Question'

const Module = (props) => {

      const [isActive, setActive] = useState(false);
    
      const toggleClass = () => {
        setActive(!isActive);
      };
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
        console.log(props);
        return questions.map(question => {
            return <Question data={question} />
        })
    }

    return (
        <div className="container mt-3">
            <h6 className="">Module {props.moduleId}</h6>
            <h6>Attempts</h6>
            {/* Render attempts here */}
            <input name="quiz" id="quiz" class={`btn btn-primary ${isActive ? 'invisible' : 'visible'}`} type="button" value="Attempt Quiz?" onClick={() => {toggleClass()}} />
            <div className={`container quiz ${isActive ? 'visible' : 'invisible'}`}>
                <form method="post">
                {renderQuestions()}
                <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Module
