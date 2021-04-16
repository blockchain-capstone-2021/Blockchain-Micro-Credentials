import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import api from '../../apis/api'

class StudentList extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             students: null
        }
    }

    async componentDidMount(){
        const response = await api.get('/student');
        this.setState({students: response.data.students.map(student => {
            return (
                <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.studentName}</td>
                    <td>{student.degreeId}</td>
                    <td>{student.studentEmail}</td>
                    <td>{student.studentCreditPoints}</td>
                    <td><Link to={`/student/${student.studentId}`} className="btn btn-primary">Go</Link></td>
                </tr>
            )
        })})
    }

    render() {
        return (
            <div className="container">
                <h1>Students</h1>
                <Link to="/student/create" className="btn btn-success">Add +</Link>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="row">Id</th>
                            <th>Name</th>
                            <th>Degree Id</th>
                            <th>Email</th>
                            <th>Credit Points</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!this.state.students ? <tr><td colSpan="6">Loading</td></tr> : this.state.students}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default  StudentList