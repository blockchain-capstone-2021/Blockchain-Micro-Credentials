import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'
import "./Dashboard.css";


const StudentDashboard = (props) => {
  const history = useHistory()

  const [availableEnrolments, setAvailableEnrolments] = useState()
  const [unavailableEnrolments, setUnavailableEnrolments] = useState()
  const [unitMap, setUnitMap] = useState()
  useEffect(() => {
    async function initState(){
      await microcredapi.get(`/student/${window.localStorage.getItem('userId')}/enrolled`).then(response => {
        console.log(response.data);
        setUnavailableEnrolments(response.data.enrolments.unavailable ? response.data.enrolments.unavailable: undefined)
        setAvailableEnrolments(response.data.enrolments.available ? response.data.enrolments.available: undefined)
        setUnitMap(response.data.unitMap)
      })
    }
    initState()
  }, [])

  function renderEnrolments(enrolmentsArray, type) {
    const isAvailable = type == 'AVAILABLE'? true : false
    return enrolmentsArray.map(enrolment => {
      return (
        <tr>
        <td scope="row">{unitMap ? unitMap[enrolment.unitId]: "Loading"}</td>
        <td>{enrolment.semOfEnrolment}</td>
        <td>          {
            isAvailable?
            <Link to={{pathname:`/unit/${enrolment.unitId}`, state: {enrolment, unitName: unitMap ? unitMap[enrolment.unitId]: "Loading"}}} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link>:
            ""
          }</td>
      </tr>
      )
    })
  }

  return (
    <div className="jumbotron align-center">
    <main role="main" >

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      <section className="mb-5">
      <h2 className="mt-2">Enrolments</h2>
      <h3 className="py-5">Available</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Enrolled</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
        {availableEnrolments && availableEnrolments.length > 0 ? renderEnrolments(availableEnrolments, 'AVAILABLE') :  <tr><td colSpan="3" className="text-center p-5">There are no available enrolments.</td></tr>}
        </tbody>
      </table>
      
      <h3 className="py-5">Completed</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Enrolled</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
        {unavailableEnrolments && unavailableEnrolments.length > 0 ? renderEnrolments(unavailableEnrolments, 'UNAVAILABLE') :  <tr><td colSpan="3" className="text-center p-5">There are no unavailable enrolments.</td></tr>}
        </tbody>
      </table>
      </section>
    </main>
  </div>
  )

  
}

export default StudentDashboard
