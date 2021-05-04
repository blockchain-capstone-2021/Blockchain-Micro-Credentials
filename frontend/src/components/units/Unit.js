import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi';

const Unit = (props) => {

    // Set state variables for the component
    const history = useHistory()
    const [unit, setUnit] = useState()
    const [modules, setModules] = useState()
    const [grade, setGrade] = useState()
    const [submitting, setSubmitting] = useState(false) // Set to false as should only be true when button clicked

    useEffect(() => {
        // Save unitId to localStorage
        const {unitId} = props.match.params
        window.localStorage.setItem('unitId', unitId)

        // Retrive modules from database and set as state variable
        async function getModules(){
            await microcredapi.get(`/unit/${unitId}/${window.localStorage.getItem('userId')}`).then(response => {
                const updatedModules = []
                console.log(response.data)
                const grade = {
                    finalGrade: response.data.finalGrade,
                    cumulativeScore: response.data.cumulativeScore
                }
                response.data.modules.map((module, key) => {
                    const newModule = {
                        ...module, 
                        // use Object.keys() to handle key value mismatch
                        numAttempts: response.data.numAttempts[key+ parseInt(Object.keys(response.data.numAttempts)[0])],
                        highestScore: response.data.highestScore[key+ parseInt(Object.keys(response.data.highestScore)[0])],
                        
                    }
                    updatedModules.push(newModule)
                })
                setModules(updatedModules)
                setGrade(grade)
            })
        }
        getModules()
    }, [])

    useEffect(() => {
        // Retrieve student details from database to display unit name
        // Runs only if modules has been retrieved and set
        async function getUnit() {
                const unitResponse = await microcredapi.get(`/student/${window.localStorage.getItem('userId')}/enrolled`)
                setUnit({'code': window.localStorage.getItem('unitId'), 'name': unitResponse.data.unitMap[window.localStorage.getItem('unitId')]})
        }
        if(modules){getUnit();}
    }, [modules])
    
    // Post method to submit microcredential
    async function submitMicroCredential() {
        setSubmitting(true)
        await microcredapi.get(`unit/submit/${window.localStorage.getItem('userId')}/${window.localStorage.getItem('unitId')}/${window.localStorage.getItem('enrolmentPeriod')}`)
        setSubmitting(false)
        history.push('/')
    }
    
    // Renders modules in table format
    function renderModules() {
        return modules.map(module => {
            return (
                <tr className="py-2" key={module.moduleId}>
                    <td>{module.moduleName}</td>
                    <td>{module.numAttempts}</td>
                    <td>{module.highestScore}</td>
                    <td><Link to={{pathname: `/module/${module.moduleId}`, attemptNumber: module.numAttempts}} className="btn btn-primary">Go</Link></td>
                </tr>
            )
        })
    }

    // Renders final grade in desired format
    function renderGrade() {
        return (
            <h5> Current Grade:  {grade.cumulativeScore},   {grade.finalGrade}</h5>
        )
    }

    return (
            <div className="jumbotron align-center">
            {
                submitting? 
                "Please hold while micro-credential is being submitted.": // Provides message to the user during long wait time
                <div className="container mt-5">
                {
                    unit?
                    <section>
                        <h1>{unit.name}</h1>
                        <h4>{unit.code}</h4>
                    </section>:
                    ""
                }

                <section>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th># of Attempts</th>
                                <th>Best result</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modules ? renderModules() : <tr colspan="5">Loading</tr>}
                        </tbody>
                    </table>
                    <div>
                        {
                            grade? renderGrade() : ""
                        }
                    </div>
                    <div className="d-flex">
                        <div style={{marginLeft:'auto', marginRight:'4em', paddingBottom:'5%'}}>
                            <button type="button" name="" id="" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
                        </div>
                    </div>
                </section>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Submit Modules?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure that you want to submit modules?<br/> Once submitted, you will no longer be able to take quizs for this course.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success"  data-bs-dismiss="modal" onClick={() => submitMicroCredential()}>Submit</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            </div>
    )
}

export default Unit