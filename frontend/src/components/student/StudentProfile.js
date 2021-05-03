import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'

function StudentProfile() {

    useEffect(() => {

        async function getStudent() {
            const response = await microcredapi.get(`student/${window.localStorage.getItem('userId')}`)
            setStudent({'name': response.data.student.studentName, 'id': response.data.student.studentId, 'email': response.data.student.studentEmail, 'degree': Object.values(response.data.degreeName)[1], 'credits': response.data.student.studentCreditPoints})
        }
        getStudent()

    }, [])

    return (
        <div>
            
        </div>
    )
}




export default StudentProfile
