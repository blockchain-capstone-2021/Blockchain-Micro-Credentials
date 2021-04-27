import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'

const CourseDetail = (props) => {

    const [availableStudents, setAvailableStudents] = useState([])
    const [unavailableStudents, setUnavailableStudents] = useState([])

    useEffect(() => {
        const {courseId} = props.match.params
        async function getEnrolledStudents() {
                const response = await microcredapi.get(`/unit/${courseId}/enrolled`)
                setAvailableStudents(response.data.students.available)
                setUnavailableStudents(response.data.students.unavailable)
            }
            getEnrolledStudents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function renderStudents(students, type) {
        const { courseId } = props.match.params
        return students.map(student => {
            return (
                <tr key={student.studentId} className={type === 'available' ? "" : "table-secondary"}>
                <th scope="row">{student.studentId}</th>
                <td>{student.studentName}</td>
                <td>{type === 'available' ? "Enrolled" : "Completed"}</td>
                <td>{type === 'available' ? <Link to={`/courses/${courseId}/final/${student.studentId}`} className="btn btn-primary">Go</Link> : "" }</td>
                </tr>
            )
        })
    }


    return (
        <div className="container  mt-5">
            <h1>Enrolled Students</h1>
            <table className="table mt-5">
            <thead>
                <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
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
