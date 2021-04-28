import React, { useState, useEffect } from "react";
import microcredapi from "../../apis/microcredapi";

const QuestionCreate = () => {
  const [courses, setCourses] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [modules, setModules] = useState();

  useEffect(() => {
    async function getCourses() {
      const units = await microcredapi
        .get(`/unit/${window.localStorage.getItem("userId")}`)
        .then((response) => response.data.units);
      setCourses(units);
      console.log(units);
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

  function renderUnitOptions() {
    return courses.map((course) => {
      return (
        <option key={course.unitId} value={course.unitId}>
          {course.unitName}
        </option>
      );
    });
  }

  function renderModuleOptions() {
    return modules.map((_module) => {
      return (
        <option key={_module.moduleId} value={_module.moduleId}>
          {_module.moduleName}
        </option>
      );
    });
  }

  function renderAnswerInput(number) {
      return (
        <div className="row g-3 py-2">
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id={`answer-${number}`}
            name={`answer-${number}`}
            placeholder={`Write answer #${number} here`}
          />
        </div>
        <div className="col-sm-2">
        <select className="form-select" name={`correct-${number}`} id={`answer-${number}`}>
          <option value="False">False</option>
          <option value="True">True</option>
        </select>
        </div>
      </div>
      )
  }

  function renderQuestionInput(){
      return (
        <div className="input-group py-3">
        <input
          type="text"
          className="form-control"
          placeholder="Question"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
      </div>
      )
  }

  function renderUnitModuleInput(){
    return (
        <div className="col-sm-12">
        <div className="input-group mb-3">
          <select
            className="form-select"
            id="course"
            onChange={(e) =>
              setSelectedCourse(
                e.target.options[e.target.selectedIndex].value
              )
            }
          >
            <option>Select a Course</option>
            {courses ? renderUnitOptions() : <option>Loading...</option>}
          </select>
        </div>

        <div className="input-group mb-3">
          <select className="form-select" id="course">
            <option>Select a module</option>
            {modules ? renderModuleOptions() : <option>Loading...</option>}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="container w-75">
      <h1 className="pt-5">Create a question</h1>
      <div className="row g-3">
        <div className="mt-4">
          <h4>Unit/Module Info</h4>
            {renderUnitModuleInput()}
        </div>
        <div className="mt-4">
          <div className="col-sm-12">
            <h4>Question Data</h4>
            {renderQuestionInput()}
          </div>
          <div className="mt-4">
            <h4>Answers</h4>
            {renderAnswerInput(1)}
            {renderAnswerInput(2)}
            {renderAnswerInput(3)}
            {renderAnswerInput(4)}
        </div>
        <div className="row mt-4 g-3">
        <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default QuestionCreate;
