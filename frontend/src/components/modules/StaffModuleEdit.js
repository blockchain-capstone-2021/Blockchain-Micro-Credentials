import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import '../../style.css'

const StaffModuleEdit = (props) => {

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
            <div class="form-group py-3">
            <label for="qid">Module ID</label>
            <input type="text" class="form-control" value={module.moduleNo} id="mid" disabled/>
            </div>
            <div class="form-group py-3">
            <label for="qid">Course ID</label>
            <input type="text" class="form-control" value={module.unitId} id="cid" disabled/>
            </div>
            <div class="form-group py-3">
            <label for="qid">Module Name</label>
            <input type="text" class="form-control" id="mname" value={module.moduleName} disabled/>
            </div>

            <div class="form-group py-3">
            <label for="qid">Published</label>
            <input type="text" class="form-control" id="mpublished" value={module.published == 0 ? 'Unpublished' : 'Published'} disabled/>
            </div>
            <div class="form-group py-3">
            <label for="mid">Weight</label>
            <input type="text" class="form-control" id="mweight" value={`${module.weight}%`} disabled/>
            </div>
            <div class="form-group py-3">
            <label for="content">No of Questions</label>
            <input type="number" min="1" class="form-control" id="mquestions" onChange={(e) => onQuestionCountChange(e)} value={newQuestionCount ? newQuestionCount : module.noOfQuestions} />
            </div>
            <div className="d-flex">
                <button type="button" class="btn btn-primary align-button-right" onClick={(e) => onSubmit(e)}> Submit</button>
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
