import React, { Component } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'

class StudentList extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            history: this.props.history,
            students: null,
            redirect: null
        }
        this.setRedirect = this.setRedirect.bind(this)
    }

    async componentDidMount(){
        const response = await microcredapi.get('/student');
        this.setState({students: response.data.students.map(student => {
            return (
                <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.studentName}</td>
                    <td>{student.degreeId}</td>
                    <td>{student.studentEmail}</td>
                    <td>{student.studentCreditPoints}</td>
                    <td>
                    <Link to={`/student/${student.studentId}`} className="btn btn-warning"> Edit </Link>
                    <button type="button" className="btn btn-danger mx-2" data-bs-toggle="modal" data-bs-studentname={student.studentName} data-bs-studentid={student.studentId} data-bs-target="#deleteConf" onClick={() => {this.displayDeleteModal(this.state.history, this.setRedirect)}}>
                    Delete
                </button>
                    </td>
                </tr>
            )
        })})
    }

    setRedirect() {
        this.setState({redirect: '/students'})
    }

    displayDeleteModal(history, redirect) {
        const el = document.getElementById('deleteConf')
        el.addEventListener('show.bs.modal', function (event) {
          const button = event.relatedTarget
          const name = button.getAttribute('data-bs-studentname')
          const studentId = button.getAttribute('data-bs-studentid')
          const modalTitle = el.querySelector('.modal-title')
          const modalBodyInput = el.querySelector('.modal-body p')
          const deleteButton = document.getElementById('del')
          modalTitle.innerHTML = 'Delete \'' + name + '\'?'
          modalBodyInput.innerHTML = 'Are you sure that you want to delete\'' + name + '\'? This action is irreversible.'
          deleteButton.onclick = async function() {
            await microcredapi.post(`/student/${studentId}/delete`)
            redirect()
          }
        })
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
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

                <div className="modal fade" id="deleteConf" tabIndex="-1" aria-labelledby="deleteConf" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p></p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <Link to="/students" className="btn btn-danger" id="del" data-bs-dismiss="modal">Delete</Link>
                        {/* <button type="button" className="btn btn-danger" id="del" data-bs-dismiss="modal">Delete</button> */}
                    </div>
                    </div>
                </div>
                </div>

            </div>
        )
    }
}

export default withRouter(StudentList)