import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import api from '../../apis/api'
class StudentDashboard extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      enrolments: null
    }
  }

  componentDidMount = async () => {
    this.renderEnrolments()
  }

  renderEnrolments = async () => {
    const studentId = window.localStorage.getItem('studentId');
    const response = await api.get(`/student/${studentId}/enrolments`)
    this.setState({enrolments:
      response.data.enrolments.map((enrolment, key) => {
        return (
          <div className="card" style={{width: '18rem'}}>
          <div className="card-body">
            <h5 className="card-title">{enrolment.unitId}</h5>
            <p className="card-text">Enrolled for:<br/>{enrolment.semOfEnrolment}</p>
            <Link to={`/unit/${enrolment.unitId}`} className="btn btn-primary" onClick={() => {window.localStorage.setItem('enrolmentPeriod', enrolment.semOfEnrolment)}}>Go</Link>
          </div>
        </div>
        )
      })
    })
  }
  
  render() {
    return (
      <div className="container">
          <main role="main" ><div className="chartjs-size-monitor" className="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div className="chartjs-size-monitor-expand" className="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div className="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div className="chartjs-size-monitor-shrink" className="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div className="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Dashboard</h1>
        </div>
        <section className="mb-5">
        <h2>Enrolments</h2>
        {this.state.enrolments}
        </section>
      </main>
      </div>
  )
  }
}

export default StudentDashboard
