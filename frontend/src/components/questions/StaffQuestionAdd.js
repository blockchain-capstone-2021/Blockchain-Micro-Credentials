import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import microcredapi from "../../apis/microcredapi";
import '../../style.css'

const StaffQuestionAdd = (props) => {
  
  // state variables
  const history = useHistory()
  const [selectedCourse, setSelectedCourse] = useState();
  const [, setModules] = useState();
  const [payload, setPayload] = useState(
    {
      questionContent:undefined,
      moduleId: props.location.state.module,
      answers:[
    {content: undefined, isCorrect: true},
    {content: undefined, isCorrect: false},
    {content: undefined, isCorrect: false},
    {content: undefined, isCorrect: false},
  ]})

  // API calls to get course and module information
  useEffect(() => {
    async function getCourses() {
      const units = await microcredapi
        .get(`/unit/${window.localStorage.getItem("userId")}`)
        .then((response) => response.data.units);
    }
    getCourses();
  }, []);

  useEffect(() => {
    async function getModules() {
      await microcredapi
        .get(`module/${selectedCourse}`)
        .then((response) => setModules(response.data.modules));
    }
    getModules();
  }, [selectedCourse]);

  // Form inputs for answer section
  function renderAnswerInput(number) {
      return (
        <div className="row g-3 py-2">
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id={`answer-${number}`}
            name={`answer-${number}`}
            placeholder={number === 0 ? 'Write CORRECT answer here.' : 'Write INCORRECT answer here.'}
            onChange={e => onAnswerChange(e, number)}
          />
        </div>
        <div className="col-sm-2">
        <input
        type="text"
        className="form-control"
        id={number === 0 ? `answer_${number}_TRUE` : `answer_${number}FALSE`}
        name={number === 0 ? `answer_${number}_TRUE` : `answer_${number}FALSE`}
        value={number === 0 ? "TRUE" : 'FALSE'}
        disabled
        style={number === 0 ? {marginBottom: '2em'} : {}}
        />
        </div>
      </div>
      )
  }

  // Stores question content into state
  function onQuestionChange(e){
    setPayload({...payload, questionContent: e.target.value})
  }

  // Stores answer content into state
  function onAnswerChange(e, number) {
    const newPayload = payload
    newPayload.answers[number].content = e.target.value
    setPayload({...payload})
  }

  // Validates whether all relevant data has been included
  function validateData(){
    const hasQuestion = payload.questionContent ? true : false
    let hasAnswers = []
    payload.answers.forEach(answer => {
      answer.content ? hasAnswers.push(true) : hasAnswers.push(false)
    });
    return({question: hasQuestion, answers: hasAnswers.includes(false) ? false : true})
  }

  // API call to create the question and add it to the module.
  function onQuestionSubmit() {
    const validate = validateData()
    if (validate.question && validate.answers) {
      microcredapi.post('/questions/create', payload)
    }
    setTimeout(() => {
      history.push('/manage/questions')
    }, 1000);
  }

  // Render question form input section
  function renderQuestionInput(){
      return (
        <div className="input-group py-3">
        <input
          type="text"
          className="form-control"
          placeholder="Question"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={e => onQuestionChange(e)}
        />
      </div>
      )
  }

  return (
    <div className="container align-center">
      <h1 className="pt-5">Create a question</h1>
      <div className="row g-3">
        <div className="mt-4">
          <div className="col-sm-12">
            <h4>Question Data</h4>
            {renderQuestionInput()}
          </div>
          <div className="mt-4">
            <h4>Answers</h4>
            {renderAnswerInput(0)}
            {renderAnswerInput(1)}
            {renderAnswerInput(2)}
            {renderAnswerInput(3)}
        </div>
        <div className="row mt-4 g-3">
        <button type="submit" className="btn btn-primary btn-block" onClick={() => onQuestionSubmit()}>Submit</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StaffQuestionAdd;
