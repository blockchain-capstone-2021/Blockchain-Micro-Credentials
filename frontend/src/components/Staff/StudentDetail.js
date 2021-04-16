import React, { Component } from 'react'
import api from '../../apis/api'
import StudentForm from './StudentForm'

class StudentDetail extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             studentId: this.props.match.params.studentId
        }
    }

    async componentDidMount() {
        const response = await api.get(`/student/${this.state.studentId}`)
        this.setState({student: response.data.student[0]})
        this.setState({form : <StudentForm student={response.data.student[0]} />})
    }

    renderForm(){
        if(!this.state.student) {
            return <p>Loading</p>
        }
        return(
            <form>
                <div className="form-group  my-4">
                    <label htmlFor="studentId">Student Id</label>
                    <input type="text" className="form-control" id="studentId" aria-describedby="studentId" placeholder="" value={this.state.student.studentId} readOnly />
                </div>
                <div className="form-group  my-4">
                    <label htmlFor="studentName">Student Name</label>
                    <input type="text" className="form-control" id="studentName" aria-describedby="studentName" placeholder="" value={this.state.student.studentName} />
                </div>
                <div className="form-group  my-4">
                    <label htmlFor="studentEmail">Student Email</label>
                    <input type="text" className="form-control" id="studentEmail" aria-describedby="studentEmail" placeholder="" value={this.state.student.studentEmail} />
                </div>
                <div className="form-group  my-4">
                    <label htmlFor="studentCreditPoints">Credit Points</label>
                    <input type="text" className="form-control" id="studentCreditPoints" aria-describedby="studentCreditPoints" placeholder="" value={this.state.student.studentCreditPoints} readOnly />
                </div>
                <div className="form-group  my-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="" value={this.state.student.studentCreditPoints} readOnly />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )
    }
    
    render() {
        return (
            <div className="container">
                <h1>Student Details</h1>
                {this.state.form}
            </div>
        )
    }
}

export default  StudentDetail