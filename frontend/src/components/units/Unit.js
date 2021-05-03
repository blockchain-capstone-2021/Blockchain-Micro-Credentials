import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi';
import "../dashboards/Dashboard.css";


const Unit = (props) => {

    // Set state variables for the component
    const history = useHistory()
    const [unit, setUnit] = useState()
    const [modules, setModules] = useState()
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        // Save unitId to localStorage
        const {unitId} = props.match.params
        window.localStorage.setItem('unitId', unitId)
        console.log(unitId)

        // Retrive modules from database and save as state variable
        async function getModules(){
            await microcredapi.get(`/unit/${unitId}/${window.localStorage.getItem('userId')}`).then(response => {
                const updatedModules = []
                console.log("modules", response.data)
                response.data.modules.map((module, key) => {
                    const newModule = {
                        ...module, 
                        numAttempts: response.data.numAttempts[key+1],
                        highestScore: response.data.highestScore[key+1]
                        }
                        updatedModules.push(newModule)
                })
                setModules(updatedModules)
            })
        }
        getModules()
    }, [])

    useEffect(() => {
        console.log("unitId", window.localStorage.getItem('unitId'))

        // Make calls
        async function getUnit() {
                const unitResponse = await microcredapi.get(`/student/${window.localStorage.getItem('userId')}/enrolled`)
                console.log("response", unitResponse.data)
                setUnit({'code': window.localStorage.getItem('unitId'), 'name': unitResponse.data.unitMap[window.localStorage.getItem('unitId')]})
        }
        if(modules){getUnit();}
    }, [modules])
    

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

    async function submitMicroCredential() {
        setSubmitting(true)
        await microcredapi.get(`unit/submit/${window.localStorage.getItem('userId')}/${window.localStorage.getItem('unitId')}/${window.localStorage.getItem('enrolmentPeriod')}`)
        setSubmitting(false)
        history.push('/')
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
                    <button type="button" name="" id="" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
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
