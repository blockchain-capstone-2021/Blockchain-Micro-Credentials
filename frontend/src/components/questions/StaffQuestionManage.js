import React, { useState, useEffect } from "react";
import microcredapi from "../../apis/microcredapi";
import { Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../../style.css'

const StaffQuestionManage = () => {

  // State Variables
  const history = useHistory()
  const [courses, setCourses] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedModule, setSelectedModule] = useState();
  const [modules, setModules] = useState();
  const [questions, setQuestions] = useState()
  const [redirect, ] = useState()
  
  // Set state before component mount
  useEffect(() => {
    return () => {
      setSelectedCourse({})
      setSelectedModule({})
    }
  }, [])

  // APi call to get data
  useEffect(() => {
    async function getCourses() {
      const units = await microcredapi
        .get(`/unit/${window.localStorage.getItem("userId")}`)
        .then((response) => response.data.units);
      setCourses(units);
      
    }
    getCourses();
  }, []);

  useEffect(() => {
    async function getModules() {
      await microcredapi
        .get(`module/${selectedCourse}`)
        .then((response) => setModules(response.data.modules));
    } 
    try {
      window.localStorage.setItem('selectedCourse',selectedCourse)
      getModules();
    } catch (error) {
      
    }

  }, [selectedCourse]);

  useEffect(() => {
    async function getQuestions() {
      await microcredapi
        .get(`questions/${selectedModule}/1`)
        .then((response) => setQuestions(response.data.questions));
    }
    if(selectedModule){getQuestions();}
    window.localStorage.setItem('selectedModule',selectedModule)
  }, [selectedModule]);

  // Render units as options on the webpage
  function renderUnitOptions() {
    return courses.map((course) => {
      return (
        <option key={course.unitId} value={course.unitId}>
          {course.unitName}
        </option>
      );
    });
  }

  // Render modules as options in the dropdown of the search form
  function renderModuleOptions() {
    return modules.map((_module) => {
      return (
        <option key={_module.moduleId} value={_module.moduleId} disabled={_module.published}>
          {_module.moduleName}
        </option>
      );
    });
  }

  // Render questions as table rows on the webpage
  function renderQuestions() {
      return questions.map((_question) => {
          return (
            <tr key={_question.questionId}>
                <td>{_question.questionId}</td>
                <td>{_question.content}</td>
                <td className="d-flex">
                  <div className="align-button-right">
                  </div>
                <Link to={{pathname: `/question/${_question.questionId}`, state:{question: _question}}} className="btn btn-warning mx-1">View</Link>
                <button type="button" className="btn btn-danger mx-2" data-bs-questionid={_question.questionId} data-bs-moduleid={_question.moduleId} data-bs-toggle="modal"  data-bs-target="#deleteConf" onClick={displayDeleteModal('DELETE', history, redirect)}>
                    Delete
                </button>   
                </td>
            </tr>
          )
      })
  }

  // Injects relevant delete data into the modal
  function displayDeleteModal(type, history, redirect) {
      const confId = type === 'DELETE_ALL' ? 'deleteConfAll' : 'deleteConf'
      const el = document.getElementById(confId)
      el.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget
        const qid = button.getAttribute('data-bs-questionid')
        const mid = button.getAttribute('data-bs-moduleid')
        const modalTitle = el.querySelector('.modal-title')
        const modalBodyInput = el.querySelector('.modal-body p')
        const delIdentifier = confId === 'deleteConfAll' ? 'delAll_deleteConfAll' : 'delAll_deleteConf'
        const deleteButton = document.getElementById(delIdentifier)
        if(qid && mid) {
          modalTitle.innerHTML = 'Delete question \'' + qid + '\'?'
          modalBodyInput.innerHTML = 'Are you sure that you want to delete question \'' + qid + '\' from module \''+ mid +'\'? This action is irreversible.'
          deleteButton.onclick = async function() {
          await microcredapi.post(`/questions/${qid}/delete`).then(
              setTimeout(() => {
                window.location.reload()
              }, 2000)
            ) 
          }
        } else if (mid) {
          modalTitle.innerHTML = 'Delete all questions?'
          modalBodyInput.innerHTML = 'Are you sure you want to delete all the questions in this module? This action is irreversible.'
          deleteButton.onclick = async function() {
          await microcredapi.post(`/questions/${mid}/deleteAll`).then(
            setTimeout(() => {
              window.location.reload()
            }, 2000)
            )
          }
        }

      })
  }

  // Function to render the modal popup.
  function renderModal(modType) {
    const isDeleteAll = modType === 'DELETE_ALL' ? 'deleteConfAll' : 'deleteConf'
    return (
      <div className="modal fade" id={isDeleteAll} tabIndex="-1" aria-labelledby="deleteConf" aria-hidden="true">
      <div className="modal-dialog">
          <div className="modal-content">
          <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Delete all questions?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
              <p>Are you sure you want to delete all the questions in this module? This action is irreversible.</p>
          </div>
          <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" id={`delAll_${isDeleteAll}`}  data-bs-dismiss="modal">Delete</button>
          </div>
          </div>
      </div>
      </div>
    )
  }

  const linkTarget = {
    pathname:'/',
    key: uuidv4(),
    state: {
      applied: true
    }
  }

  function renderUnitModuleInput(){
    return (
        <div className="row row-cols-lg-auto g-3 align-items-center py-2">
        <div className="input-group col-lg-5">
          <select
            className="form-select"
            id="course"
            onChange={(e) =>
              setSelectedCourse(
                e.target.options[e.target.selectedIndex].value
              )
            }
            defaultValue={0}
          >
            <option>Select a Course</option>
            {courses ? renderUnitOptions() : <option>Loading...</option>}
          </select>
        </div>

        <div className="input-group col-lg-5">
          <select className="form-select" id="course"
            onChange={(e) =>
              setSelectedModule(
                e.target.options[e.target.selectedIndex].value
            )
            }
            defaultValue={0}
            >
            <option>Select a module</option>
            {modules ? renderModuleOptions() : <option>Loading...</option>}
          </select>
        </div>
      </div>
    )
  }
  return (
    <div className="container align-center">
      <h1 className="pt-5 mb-5">Question management</h1>
      <div className="row g-3">
        <div className="my-4">
          <h6>Unit/Module Selection</h6>
            {renderUnitModuleInput()}
            {selectedModule?
                        <div className="d-flex">
                        <div className="align-button-right">
                          <Link to={{pathname: '/question/create', state:{module: selectedModule, course: selectedCourse}}} className="btn btn-success">Add</Link>  
                        </div>
                        <div>
                        <Link to={linkTarget} className="btn btn-danger" data-bs-toggle="modal"  data-bs-target="#deleteConfAll" data-bs-moduleid={selectedModule} onClick={displayDeleteModal('DELETE_ALL', history, redirect)}>Delete all</Link>
                        </div>
                      </div>:
                      ""}
        </div>
        <div className="mt-4">
          <div className="col-sm-12">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {questions && questions.length > 0 ? renderQuestions(): <tr><td colSpan="4" className="p-5 text-center">There are no questions for this module</td></tr>}
                </tbody>
            </table>
          </div>
      </div>
    </div>
    {renderModal('DELETE_ALL')}
    {renderModal('DELETE')}
    </div>
  );
};

export default StaffQuestionManage;
