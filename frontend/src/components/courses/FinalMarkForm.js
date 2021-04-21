import React, {useState, useEffect} from 'react'
import microcredapi from '../../apis/microcredapi'

const FinalMarkForm = (props) => {

    const [student, setStudent] = useState()
    const [finalMark, setFinalMark] = useState()

    useEffect(() => {
        async function getStudent() {
            const response = await microcredapi.get(`/students/${props.match.params.studentId}`).then(response => response.data.student)
            setStudent(response)
        }
        getStudent()
    }, [])

    function onSubmit(e) {
        e.preventDefault();
        console.log(student.studentId, props.match.params.courseId,finalMark);
    }

    return (
        <div className="container">
            {
                student?
                <form>
                <fieldset>
                    <legend>Student Details</legend>
                    <div class="mb-3">
                    <label for="studentId" class="form-label">Id</label>
                    <input type="text" id="studentId" class="form-control" value={student.studentId}  disabled/>
                    </div>
                    <div class="mb-3">
                    <label for="studentName" class="form-label">Name</label>
                    <input type="text" id="studentName" class="form-control" value={student.studentName}  disabled/>
                    </div>
                    <div class="mb-3">
                    <label for="studentEmail" class="form-label">Email</label>
                    <input type="text" id="studentEmail" class="form-control" value={student.studentEmail}  disabled/>
                    </div>
                    <div class="mb-3">
                    <label for="studentCreditPoints" class="form-label">Credit Points</label>
                    <input type="text" id="studentCreditPoints" class="form-control" value={student.studentCreditPoints}  disabled/>
                    </div>
                    <div class="mb-3">
                    <label for="finalMark" class="form-label">Final Mark</label>
                    <input type="number" id="finalMark" class="form-control" max="100" onChange={(e) => {setFinalMark(e.target.value)}}/>
                    </div>
                    <button class="btn btn-primary" onClick={(e) => onSubmit(e)}>Submit</button>
                </fieldset>
                </form>:
                "Loading"
            }
        </div>
    )
}

export default FinalMarkForm