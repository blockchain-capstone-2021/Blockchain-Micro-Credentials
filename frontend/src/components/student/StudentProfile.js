import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'

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
                        <div className="mb-3">
                            <label htmlFor="inputID" className="form-label">Student ID:</label>
                            <input type="text" className="form-control" id="id" disabled = {true} defaultValue={student.id}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputEmail" className="form-label">Email address:</label>
                            <input type="email" className="form-control" id="email" disabled = {true} defaultValue={student.email}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputDegree" className="form-label">Degree:</label>
                            <input type="text" className="form-control" id="degree" disabled = {true} defaultValue={student.degree}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputCredits" className="form-label">Credits:</label>
                            <input type="text" className="form-control" id="credits" disabled = {true} defaultValue={student.credits}></input>
                        </div>
                        </form>
                        
                    </section>:
                    ""
                }

        </div>
    )
}

export default StudentProfile