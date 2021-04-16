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
        this.setState({form : <StudentForm student={response.data.student[0]} history={this.props.history} />})
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