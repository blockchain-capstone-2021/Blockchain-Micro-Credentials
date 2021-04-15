import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../../apis/api'

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
    }

    renderForm(){
        if(!this.state.student) {
            return <p>Loading</p>
        }
        return(
            <form>
                <div class="form-group  my-4">
                    <label for="studentId">Student Id</label>
                    <input type="text" class="form-control" id="studentId" aria-describedby="studentId" placeholder="" value={this.state.student.studentId} readOnly />
                </div>
                <div class="form-group  my-4">
                    <label for="studentName">Student Name</label>
                    <input type="text" class="form-control" id="studentName" aria-describedby="studentName" placeholder="" value={this.state.student.studentName} />
                </div>
                <div class="form-group  my-4">
                    <label for="studentEmail">Student Email</label>
                    <input type="text" class="form-control" id="studentEmail" aria-describedby="studentEmail" placeholder="" value={this.state.student.studentEmail} />
                </div>
                <div class="form-group  my-4">
                    <label for="studentCreditPoints">Credit Points</label>
                    <input type="text" class="form-control" id="studentCreditPoints" aria-describedby="studentCreditPoints" placeholder="" value={this.state.student.studentCreditPoints} readOnly />
                </div>
                <div class="form-group  my-4">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="" value={this.state.student.studentCreditPoints} readOnly />
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
        )
    }
    
    render() {
        return (
            <div className="container">
                <h1>Student Details</h1>
                {this.renderForm()}
            </div>
        )
    }
}

export default  StudentDetail