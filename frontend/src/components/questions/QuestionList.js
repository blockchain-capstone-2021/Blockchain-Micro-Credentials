import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const QuestionList = () => {

    const [questions, setquestions] = useState([])

    useEffect(() => {

    }, [])

    return (
        <div className="containr w-75">
            <h1>Questions</h1>
            <Link to="/question/add" className="btn btn-success">Add</Link>
        </div>
    )
}

export default QuestionList
