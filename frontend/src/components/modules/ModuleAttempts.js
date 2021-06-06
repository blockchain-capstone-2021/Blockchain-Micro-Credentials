import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'
import '../../style.css'

const ModuleAttempts = (props) => {
    // Set state variables for the component
    const [student, setStudent] = useState();
    const [modules, setModules] = useState();
    const [attempts, setAttempts] = useState();
    const [selectedModule, setSelectedModule] = useState();

    // Set state before component mount
    useEffect(() => {
        return () => {
        setSelectedModule({})
        }
    }, [])

    // API call to get student data
    useEffect(() => {
        function getStudent() {
            microcredapi
                .get(`/student/${props.match.params.studentId}`)
                .then(response => setStudent(response.data.student));
        }
        getStudent()
    }, [])

    useEffect(() => {
        async function getModules(){
            await microcredapi.get(`/unit/${props.match.params.courseId}/${student.studentId}`).then(response => {
                const updatedModules = []
                response.data.modules.map((module, key) => {
                    const newModule = {
                        ...module, 
                        // use Object.keys() to handle key value mismatch
                        numAttempts: response.data.numAttempts[key+ parseInt(Object.keys(response.data.numAttempts)[0])],
                        highestScore: response.data.highestScore[key+ parseInt(Object.keys(response.data.highestScore)[0])],
                    }
                    console.log(newModule);
                    updatedModules.push(newModule)
                    return true
                })
                setModules(updatedModules)
            }) 
        }
        if(student){getModules();}
    }, [student]);

    useEffect(() => {
        function getAttempts(){  
            const moduleAttempts = []
            if(selectedModule-1 >= 0){
                for(var i = 1; i <= modules[selectedModule-1].numAttempts; i++){
                    moduleAttempts.push(
                        {
                            "attemptNo": i
                        }
                    )
                }
            }
            setAttempts(moduleAttempts)
        }
        if(selectedModule){getAttempts();}
    }, [selectedModule]);

    // Render modules as options in the dropdown of the search form
    function renderModuleOptions() {
        return modules.map((_module) => {
            return (
                <option key={_module.moduleId} value={_module.moduleId}>
                {_module.moduleName}
                </option>
            );
        });
    }

    function renderUnitModuleInput(){
        return (
            <div className="row row-cols-lg-auto g-3 align-items-center py-2">
            <div className="input-group col-lg-5">
              <select className="form-select"
                onChange={(e) =>
                    setSelectedModule(
                      e.target.options[e.target.selectedIndex].value
                    )
                }
                defaultValue={0}
                >
                <option>Select a module</option>
                {modules ? renderModuleOptions() : <option disabled = {true}>Loading...</option>}
              </select>
            </div>
          </div>
        );
    }

    function renderBestAttempt(){
        if(selectedModule-1 >= 0){
            if(modules[selectedModule-1].numAttempts > 0){
                return(
                    <div> 
                        <tr>
                            <td>
                                <h6>Best attempt: {modules[selectedModule-1].highestScore}</h6>
                            </td>
                            <td>
                                <Link to={`/module/attempt/${student.studentId}/${props.match.params.courseId}/${selectedModule}/highest`} className="btn btn-primary">View</Link>
                            </td>
                        </tr>

                    </div>
                );
            }
        }
    }

    function renderStudentDetails(){
        if(student){
            return(
                <div> 
                    <h5>Student: {student.studentId} - {student.studentName}</h5>
                </div>
            );
        }
    }

    function renderAttempts(){
        if(selectedModule){
            return attempts.map((_attempt) => {
                return (
                  <tr key={_attempt.attemptNo}>
                      <td>{_attempt.attemptNo}</td>
                      <td className="d-flex">
                        <div className="align-button-right">
                        </div>
                        <Link to={`/module/attempt/${student.studentId}/${props.match.params.courseId}/${selectedModule}/${_attempt.attemptNo}`} className="btn btn-primary">View</Link>
                      </td>
                  </tr>
                )
            })
        } 
    }

    // Render the page elements 
    return (
        <div className="jumbotron align-center">
            <section>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h1">Module Attempts</h1>
                </div>
                <h5>Course: {props.match.params.courseId}</h5>
                {renderStudentDetails()}
                <div className="my-4">
                    <h6>Module Selection</h6>
                    {renderUnitModuleInput()}
                </div>
                {renderBestAttempt()}
                <div className="mt-4">
                    <div className="col-sm-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Attempt Number</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts && attempts.length > 0 ? renderAttempts() : <tr><td colSpan="6" className="p-5 text-center">No attempts for the selected module</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ModuleAttempts
