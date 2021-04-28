import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'

function StudentProfile() {

    useEffect(() => {

        async function getStudent() {
            const response = await microcredapi.get(`student/${window.localStorage.getItem('userId')}`)
            console.log(response.data);
        }
        getStudent()

    }, [])

    return (
        <div>
            
        </div>
    )
}




export default StudentProfile
