import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'

const StudentProfile = (props) => {

    const [student, setStudent] = useState()

    useEffect(() => {

        async function getStudent() {
            const response = await microcredapi.get(`student/${window.localStorage.getItem('userId')}`)
            console.log(response.data)
            setStudent({'name': response.data.student.studentName, 'id': response.data.student.studentId, 'email': response.data.student.studentEmail, 'degree': Object.values(response.data.degreeName)[1], 'credits': response.data.student.studentCreditPoints})
        }
        getStudent()
    }, [])
    console.log(student)

    return (
        <div className="container mt-5">
                {
                    student?
                    <section>
                        <h1>Hello, {student.name}!</h1>
                        <form>
                        <p>Student ID:</p>  
                        <input type='text' disabled = {true} defaultValue={student.id} />
                        <p>Email:</p> 
                        <input type='email' disabled = {true} defaultValue={student.email} />
                        <p>Degree:</p> 
                        <input type='text' disabled = {true} defaultValue={student.degree} />
                        <p>Credits:</p> 
                        <input type='text' disabled = {true} defaultValue={student.credits} />
                        </form>
                        
                    </section>:
                    ""
                }

        </div>
    )
}

export default StudentProfile