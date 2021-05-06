import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import '../../style.css'

const StaffModuleEdit = (props) => {

    // State variables

    const history = useHistory()
    const [module, setModule] = useState()
    const [newQuestionCount, setNewQuestionCount] = useState()

    // Get module data
    useEffect(() => {
        
        async function getModule() {
            const response = await microcredapi.get(`/module/${props.match.params.moduleId}/info`)
            setModule(response.data.module)
        }
        getModule()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Set noOFQuestion form input to state.
    function onQuestionCountChange(e){
        setNewQuestionCount(e.target.value)
    }

    // API call to change number of questions for a module.
    function onSubmit(e){
        e.preventDefault();
        async function changeNoOfQuestions(){
            const response = await microcredapi.get(`/module/${props.match.params.moduleId}/edit/${newQuestionCount}`)
            if (response.data.success) {
                history.push('/manage/modules')
            }
        }
        changeNoOfQuestions()
    }

    // method for form
    function renderForm(){
        if (module) {
            return (
            <form className="align-center">
            <h1>Module Edit</h1>
            <div className="form-group py-3">
            <label htmlFor="qid">Module ID</label>
            <input type="text" className="form-control" value={module.moduleNo} id="mid" disabled/>
            </div>
            <div className="form-group py-3">
            <label htmlFor="qid">Course ID</label>
            <input type="text" className="form-control" value={module.unitId} id="cid" disabled/>
            </div>
            <div className="form-group py-3">
            <label htmlFor="qid">Module Name</label>
            <input type="text" className="form-control" id="mname" value={module.moduleName} disabled/>
            </div>

            <div className="form-group py-3">
            <label htmlFor="qid">Published</label>
            <input type="text" className="form-control" id="mpublished" value={module.published === 0 ? 'Unpublished' : 'Published'} disabled/>
            </div>
            <div className="form-group py-3">
            <label htmlFor="mid">Weight</label>
            <input type="text" className="form-control" id="mweight" value={`${module.weight}%`} disabled/>
            </div>
            <div className="form-group py-3">
            <label htmlFor="content">No of Questions</label>
            <input type="number" min="1" className="form-control" id="mquestions" onChange={(e) => onQuestionCountChange(e)} value={newQuestionCount ? newQuestionCount : module.noOfQuestions} />
            </div>
            <div className="d-flex">
                <button type="button" className="btn btn-primary align-button-right" onClick={(e) => onSubmit(e)}> Submit</button>
            </div>
            </form>
            )
        } else {
            <p>Loading</p>
        }
    }

    return (
        <div>
            {renderForm()}
        </div>
    )
}

export default StaffModuleEdit
