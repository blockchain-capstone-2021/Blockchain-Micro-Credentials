import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'
import "../dashboards/Dashboard.css";

const StudentProfile = (props) => {

    const [student, setStudent] = useState()

    useEffect(() => {

        async function getStudent() {
            const response = await microcredapi.get(`student/${window.localStorage.getItem('userId')}`)
            setStudent({'name': response.data.student.studentName, 'id': response.data.student.studentId, 'email': response.data.student.studentEmail, 'degree': Object.values(response.data.degreeName)[1], 'credits': response.data.student.studentCreditPoints})
        }
        getStudent()
    }, [])

    return (
        <div className="jumbotron align-center" >
                {
                    student?
                    <section>
                        <h1>Hello, {student.name}!</h1>
                        <form>
                        <div class="mb-3">
                            <label for="inputID" class="form-label">Student ID:</label>
                            <input type="text" class="form-control" id="id" disabled = {true} defaultValue={student.id}></input>
                        </div>
                        <div class="mb-3">
                            <label for="inputEmail" class="form-label">Email address:</label>
                            <input type="email" class="form-control" id="email" disabled = {true} defaultValue={student.email}></input>
                        </div>
                        <div class="mb-3">
                            <label for="inputDegree" class="form-label">Degree:</label>
                            <input type="text" class="form-control" id="degree" disabled = {true} defaultValue={student.degree}></input>
                        </div>
                        <div class="mb-3">
                            <label for="inputCredits" class="form-label">Credits:</label>
                            <input type="text" class="form-control" id="credits" disabled = {true} defaultValue={student.credits}></input>
                        </div>
                        </form>
                        
                    </section>:
                    ""
                }

        </div>
    )
}

export default StudentProfile