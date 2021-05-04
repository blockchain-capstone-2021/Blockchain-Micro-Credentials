import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi';
import "../dashboards/Dashboard.css";


const Unit = (props) => {

    const history = useHistory()

    const [unit, setUnit] = useState()
    const [modules, setModules] = useState()
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        // Set variables
        const {unitId} = props.match.params
        window.localStorage.setItem('unitId', unitId)

        // Make calls
        async function getModules(){
            const moduleResponse = await microcredapi.get(`/unit/${unitId}/${window.localStorage.getItem('userId')}`).then(response => {
                console.log(response.data);
                const updatedModules = []
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

        async function getUnit() {
            const unitResponse = await microcredapi.get(`/student/${window.localStorage.getItem('userId')}/enrolled`)
            setUnit({'code': Object.keys(unitResponse.data.unitMap)[0], 'name': Object.values(unitResponse.data.unitMap)[0]})
        }
        getModules()
        getUnit()
    }, [])

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
                "Please hold while micro-credential is being submitted.":
                <div className="container mt-5">
                {
                    unit?
                    <section>
                        <h1>{props.location.state.unitName}</h1>
                        <h4>{props.location.state.enrolment.unitId}</h4>
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
                    <div className="d-flex">
                    <button type="button" name="" id="" class="btn btn-primary btn-block align-button-right" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
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
