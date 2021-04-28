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
        setUnavailableEnrolments(response.data.enrolments.unavailable.length > 0 ? response.data.enrolments.unavailable: undefined)
        setAvailableEnrolments(response.data.enrolments.available.length > 0 ? response.data.enrolments.available: undefined)
        setUnitMap(response.data.unitMap)
      })
    }
    initState()
  }, [])

  function renderEnrolments(enrolmentsArray, type) {
    const isAvailable = type == 'AVAILABLE'? true : false
    return enrolmentsArray.map(enrolment => {
      return (
        <div className={`card`} style={{width: '18rem'}}>
        <div className="card-body">
          <h5 className="card-title">{unitMap ? unitMap[enrolment.unitId]: "Loading"}</h5>
          <p className="card-text">Enrolled for:<br/>{enrolment.semOfEnrolment}</p>
          {
            isAvailable?
            <Link to={`/unit/${enrolment.unitId}`} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link>:
            ""
          }
        </div>
      </div>
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
      {availableEnrolments ? renderEnrolments(availableEnrolments, 'AVAILABLE') :  "No available enrolments"}
      <h3 className="py-5">Completed</h3>
      {unavailableEnrolments ? renderEnrolments(unavailableEnrolments, 'UNAVAILABLE') : "No unavailable enrolments"}
      </section>
    </main>
  </div>
  )
}

export default StudentDashboard
