import React, {useState, useEffect} from 'react'
import {  useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'

const StudentMarkEntry = (props) => {

    // State variables
    const history = useHistory();
    const [student, setStudent] = useState()
    const [finalMark, setFinalMark] = useState()
    const [submitting, setSubmitting] = useState(false)

    // API call to get student data
    React.useEffect(() => {
        async function getStudent() {
            const response = await microcredapi.get(`/student/${props.match.params.studentId}`).then(response => response.data.student)
            setStudent(response)
        }
        getStudent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Submits final mark for student

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true)

        await microcredapi.post(`/marks/submitFinalMark/${student.studentId}/${props.match.params.courseId}/${finalMark}`).then(response => {
            history.push(`/manage/students`);
        })
        setSubmitting(false)
    }
        
    return (
        <div className="container">
            <h1 className="mt-5">Final Mark Form</h1>
            {
                submitting ?
                <p>Please hold while the form is processing.</p> :
                student ?
                <form>
                <fieldset className="mt-5">
                    
                    <div className="mb-3">
                    <label htmlFor="studentId" className="form-label">Id</label>
                    <input type="text" id="studentId" className="form-control" value={student.studentId}  disabled/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="studentName" className="form-label">Name</label>
                    <input type="text" id="studentName" className="form-control" value={student.studentName}  disabled/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="studentEmail" className="form-label">Email</label>
                    <input type="text" id="studentEmail" className="form-control" value={student.studentEmail}  disabled/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="studentCreditPoints" className="form-label">Credit Points</label>
                    <input type="text" id="studentCreditPoints" className="form-control" value={student.studentCreditPoints}  disabled/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="finalMark" className="form-label">Final Mark</label>
                    <input type="number" id="finalMark" className="form-control" max="100" onChange={(e) => {setFinalMark(e.target.value)}}/>
                    </div>
                    <div className="d-flex">
                        <button type="button" name="" id="" className="btn btn-primary btn-lg btn-block text-center align-button-right" onClick={(e) => onSubmit(e)}>Submit</button>
                    </div>
                </fieldset>
                </form> :
                <p>Loading...</p>
            }
        </div>
    )
}

export default StudentMarkEntry