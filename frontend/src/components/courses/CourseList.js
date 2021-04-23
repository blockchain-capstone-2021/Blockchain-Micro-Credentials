import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'

const CourseList = (props) => {

    const [courses, setCourses] = useState([])
    
    useEffect(() => {
            console.log(props);
        const staffId = window.localStorage.getItem('userId')
        async function getCourses() {
            const response = await microcredapi.get(`/unit/${staffId}`)
            setCourses(response.data.units)
            }
            getCourses()
        }, []
    )

    function renderCourses(){
        return courses.map(course => {
            return (
                <tr>
                <th scope="row">{course.unitId}</th>
                <td>{course.unitName}</td>
                <td><Link to={`/courses/${course.unitId}`}  class="btn btn-primary">Go</Link></td>
                </tr>
            )
        })
    }

    return (
        <div className="container pt-5">
            <h1>Courses</h1>
            <p>Courses currently being taught</p>
            <table class="table mt-5">
            <thead>
                <tr>
                <th scope="col">Unit Id</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {renderCourses()}
            </tbody>
            </table>   
        </div>
    )

}

export default CourseList
