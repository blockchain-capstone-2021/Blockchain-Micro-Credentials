import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'

const CourseDetail = (props) => {

    const [course, setcourse] = useState()
    const [availableStudents, setAvailableStudents] = useState([])
    const [unavailableStudents, setUnavailableStudents] = useState([])

    useEffect(() => {
        setcourse(props.match.params.courseId)
        async function getEnrolledStudents() {
                const response = await microcredapi.get(`/units/${course}/enrolled`)
                setAvailableStudents(response.data.students.available)
                setUnavailableStudents(response.data.students.unavailable)
            }
            getEnrolledStudents()
    }, [course])

    function renderStudents(students, type) {
        return students.map(student => {
            return (
                <tr key={student.studentId} className={type === 'available' ? "" : "table-secondary"}>
                <th scope="row">{student.studentId}</th>
                <td>{student.studentName}</td>
                <td>{student.studentCreditPoints}</td>
                <td>{type === 'available' ? "Enrolled" : "Completed"}</td>
                <td>{type === 'available' ? <Link to={`/student/${student.studentId}`} className="btn btn-primary">Go</Link> : "" }</td>
                </tr>
            )
        })
    }


    return (
        <div className="container">
            <h1>Enrolled Students</h1>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Credit Points</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            {renderStudents(availableStudents, 'available')}
            {renderStudents(unavailableStudents, 'unavailable')}
            </tbody>
            </table>
        </div>
    )
}

export default CourseDetail
