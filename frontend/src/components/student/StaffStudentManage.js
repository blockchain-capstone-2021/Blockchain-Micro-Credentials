import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'

const StaffStudentManage = () => {

    const [courses, setCourses] = useState();
    const [selectedCourse, setSelectedCourse] = useState();
    const [availableStudents, setAvailableStudents] = useState();
    const [unavailableStudents, setUnavailableStudents] = useState();

    useEffect(() => {
        async function getCourses() {
          const units = await microcredapi
            .get(`/unit/${window.localStorage.getItem("userId")}`)
            .then((response) => response.data.units);
          setCourses(units);
        }
        getCourses();
    }, []);

    useEffect(() => {
        async function getAvailableStudents() {
            const available = await microcredapi
                .get(`/unit/${selectedCourse}/enrolled`)
                .then((response) => response.data.students.available);
            setAvailableStudents(available);
        }
        if(selectedCourse){getAvailableStudents();}
    }, [selectedCourse]);

    useEffect(() => {
        async function getUnavailableStudents() {
            const unavailable = await microcredapi
                .get(`/unit/${selectedCourse}/enrolled`)
                .then((response) => response.data.students.unavailable);
            setUnavailableStudents(unavailable);
        }
        if(selectedCourse){getUnavailableStudents();}
    }, [selectedCourse]);

    function renderUnitOptions() {
        return courses.map((course) => {
          return (
            <option key={course.unitId} value={course.unitId}>
              {course.unitName}
            </option>
          );
        });
      }

    function renderUnitInput(){
        return (
            <div className="row row-cols-lg-auto g-3 align-items-center py-2">
            <div className="input-group col-lg-5">
              <select
                className="form-select"
                id="course"
                onChange={(e) =>
                  setSelectedCourse(
                    e.target.options[e.target.selectedIndex].value
                  )
                }
              >
                <option>Select a Course</option>
                {courses ? renderUnitOptions() : <option>Loading...</option>}
              </select>
            </div>
            </div>
        )
    }

    function renderStudents(students, type) {
        // const { courseId } = props.match.params
        return students.map(student => {
            return (
                <tr key={student.studentId} className={type === 'available' ? "" : "table-secondary"}>
                <th scope="row">{student.studentId}</th>
                <td>{student.studentName}</td>
                <td>{type === 'available' ? "Enrolled" : "Completed"}</td>
                <td>{type === 'available' ? <Link to={`/mark/${selectedCourse}/${student.studentId}`} className="btn btn-primary">Enter Mark</Link> : "" }</td>
                </tr>
            )
        })
    }


    return (
        <div className="container w-75">
          <h1 className="pt-5 mb-5">Student Management</h1>
          <div className="row g-3">
            <div className="my-4">
              <h6>Select a Course</h6>
                {renderUnitInput()}
            </div>
            <h2>Enrolled Students</h2>
            <div className="mt-4">
              <div className="col-sm-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableStudents && (availableStudents.length > 0) ? renderStudents(availableStudents, 'available'): <tr><td colSpan="4" className="p-5 text-center">There are no enrolled students for this course.</td></tr>}
                    </tbody>
                </table>
              </div>
            </div>
            <h2>Completed Students</h2>
            <div className="mt-4">
              <div className="col-sm-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        { unavailableStudents && (unavailableStudents.length > 0) ? renderStudents(unavailableStudents, 'unavailable'): <tr><td colSpan="4" className="p-5 text-center">There are no completed students for this course.</td></tr>}
                    </tbody>
                </table>
              </div>
            </div>
        </div>
        </div>
    );
}

export default StaffStudentManage
