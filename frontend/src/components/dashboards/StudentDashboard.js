import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'

const StudentDashboard = () => {

  // Set state variables for the component
  const [availableEnrolments, setAvailableEnrolments] = useState()
  const [unavailableEnrolments, setUnavailableEnrolments] = useState()
  const [unitMap, setUnitMap] = useState()

  // Retrieve student's enrolments from the database and set as state variable
  useEffect(() => {
    async function initState(){
      await microcredapi.get(`/student/${window.localStorage.getItem('userId')}/enrolled`).then(response => {
        setUnavailableEnrolments(response.data.enrolments.unavailable ? response.data.enrolments.unavailable: undefined)
        setAvailableEnrolments(response.data.enrolments.available ? response.data.enrolments.available: undefined)
        setUnitMap(response.data.unitMap)
      })
    }
    initState()
  }, [])

      
  // Render the enrolments as elements of a table, render differently if enrolment is completed
  function renderEnrolments(enrolmentsArray, type) {
    return enrolmentsArray.map(enrolment => {
      return (
        <tr key={enrolment.unitId} className={type === 'AVAILABLE' ? "" : "table-secondary"}>
        <th scope="row">{unitMap ? unitMap[enrolment.unitId]: "Loading"}</th>
        <td>{enrolment.semOfEnrolment}</td>
        <td>{type === 'AVAILABLE' ? "Enrolled" : "Completed"}</td>
        <td>{type === 'AVAILABLE' ? <Link to={`/unit/${enrolment.unitId}`} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link> : "" }</td>
        </tr>
    )
    })
  }

  // Render the dashboard
  return (
    <div className="jumbotron align-center">
    <main role="main" >

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      <section className="mb-5">
      <h2 className="mt-2">Enrolments</h2>
      <h3 className="py-2">Available</h3>
        <div className="mt-2">
          <div className="col-sm-12">
            <table class="table">
                <thead>
                    <tr>
                      <th scope="col">Course</th>
                      <th scope="col">Enrolment Period</th>
                      <th scope="col">Status</th>
                      <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                  {availableEnrolments ? renderEnrolments(availableEnrolments, 'AVAILABLE') :  "No available enrolments"}
                </tbody>
            </table>
          </div>
        </div>
        <h3 className="py-2">Completed</h3>
        <div className="mt-2">
          <div className="col-sm-12">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Course</th>
                        <th scope="col">Enrolment Period</th>
                        <th scope="col">Status</th>
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                  {unavailableEnrolments ? renderEnrolments(unavailableEnrolments, 'UNAVAILABLE') : "No unavailable enrolments"}
                </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>
  )
}

export default StudentDashboard
