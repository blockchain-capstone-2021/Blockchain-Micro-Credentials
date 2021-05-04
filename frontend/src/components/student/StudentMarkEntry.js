import React, {useState, useEffect} from 'react'
import {  useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'

const StudentMarkEntry = (props) => {

    // set state variables for component
    const history = useHistory();
    const [student, setStudent] = useState()
    const [finalMark, setFinalMark] = useState()
    const [submitting, setSubmitting] = useState(false)

    // retrieve student data from database and set as student variable
    useEffect(() => {
        console.log(props);
        async function getStudent() {
            const response = await microcredapi.get(`/student/${props.match.params.studentId}`).then(response => response.data.student)
            setStudent(response)
        }
        getStudent()
    }, [])

    // submit final mark using post method
    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true)
        console.log(student.studentId, props.match.params.courseId,finalMark);

        await microcredapi.post(`/marks/submitFinalMark/${student.studentId}/${props.match.params.courseId}/${finalMark}`).then(response => {
            history.push(`/manage/students`);
        })
        setSubmitting(false)
    }
        
    // render page as form
    return (
        <div className="container align-center">
            <h1 className="mt-5">Final Mark Form</h1>
            {
                submitting ?
                "Please hold while the form is processing." :
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
                        <div style={{marginLeft:'auto', marginRight:'1em'}}>
                            <button type="button" name="" id="" className="btn btn-primary btn-lg btn-block text-center" onClick={(e) => onSubmit(e)}>Submit</button>
                        </div>
                    </div>
                    
                </fieldset>
                </form> :
                "Loading..." 
            }
        </div>
    )
}

export default StudentMarkEntry