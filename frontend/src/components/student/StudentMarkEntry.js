import React, {useState, useEffect} from 'react'
import {  useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import FlashMessage from 'react-flash-message'

const StudentMarkEntry = (props) => {

    // State variables
    const history = useHistory();
    const [student, setStudent] = useState()
    const [finalMark, setFinalMark] = useState()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState()

    // API call to get student data
    React.useEffect(() => {
        async function getStudent() {
            const response = await microcredapi.get(`/student/${props.match.params.studentId}`).then(response => response.data.student)
            setStudent(response)
        }
        getStudent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onMarkChange(e){
        const value = e.target.value.replace(/[^\d]/,'');

        if(parseInt(value) >= 0) {
            setFinalMark(value)
        }
        
    }

    // Submits final mark for student

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true)
        if(finalMark > 0 && finalMark < 101) {
            await microcredapi.post(`/marks/submitFinalMark/${student.studentId}/${props.match.params.courseId}/${finalMark}`).then(response => {
                history.push(`/manage/students`);
            })
        }
        else {
            setError('Final mark value must be between 0 and 100.')
            setTimeout(() => {
                setError(undefined)
            }, 3000);
        }
        setSubmitting(false)
    }
        
    return (
        <div className="container">
            <h1 className="mt-5">Enter Final Mark</h1>
            {
                submitting ?
                <p>Please hold while the form is processing.</p> :
                student ?
                <form>
                {
                    error ?
                    <FlashMessage duration={8000}>
                    <div className="my-5 text-center">
                    <p className="alert alert-danger text-break">{error}</p>
                    </div>
                    </FlashMessage>:
                ''
                }
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
                    <input type="number" id="finalMark" className="form-control" min="0" max="100" onChange={(e) => onMarkChange(e)} value={finalMark}/>
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