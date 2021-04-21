import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import api from '../../apis/api'
import "./Dashboard.css";

class StudentDashboard extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      enrolments: null
    }
  }

  componentDidMount = async () => {
    this.setEnrolmentState()
   
  }

  renderAvailableEnrolments = () => {
    return this.state.available.map(enrolment => {
      const unitId = enrolment.unitId
      console.log(this.state.unitMap);
      return (
        <div className="card" style={{width: '18rem'}}>
        <div className="card-body">
          <h5 className="card-title">{this.state.unitMap ? this.state.unitMap[unitId]: "Loading"}</h5>
          <p className="card-text">Enrolled for:<br/>{enrolment.semOfEnrolment}</p>
          <Link to={`/unit/${enrolment.unitId}`} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link>
        </div>
      </div>
      )
    })
  }

  renderUnavailableEnrolments = () => {
    return this.state.unavailable.map(enrolment => {
      const unitId = enrolment.unitId
      return (
        <div className="card" style={{width: '18rem'}}>
        <div className="card-body">
          <h5 className="card-title">{this.state.unitMap[unitId]}</h5>
          <p className="card-text">Enrolled for:<br/>{enrolment.semOfEnrolment}</p>
          <Link to={`/unit/${enrolment.unitId}`} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link>
        </div>
      </div>
      )
    })
  }

  setEnrolmentState = async () => {
    const studentId = window.localStorage.getItem('userId');
    const response = await api.get(`/student/${studentId}/enrolled`)
    this.setState({unavailable: response.data.enrolments.unavailable})
    this.setState({available: response.data.enrolments.available})
    this.setState({unitMap: response.data.unitMap})
  }
  
  render() {
    return (
      <div className="jumbotron align-center">
        <main role="main" >
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          <section className="mb-5">
          <h2>Enrolments</h2>
          <h3>Available</h3>
          {this.state.available ? this.renderAvailableEnrolments() :  "No available enrolments"}
          <h3>Unavailable</h3>
          {this.state.unavailable ? this.renderUnavailableEnrolments() : "No unavailable enrolments"}
          </section>
        </main>
      </div>
  )
  }
}

export default StudentDashboard
