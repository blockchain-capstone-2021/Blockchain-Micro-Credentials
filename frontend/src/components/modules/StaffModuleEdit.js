import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import '../../style.css'
import {Link} from 'react-router-dom'

const StaffModuleEdit = (props) => {

    // State variables
    const history = useHistory()
    const [module, setModule] = useState()
    const [newQuestionCount, setNewQuestionCount] = useState()

    // Get module data
    useEffect(() => {
        setModule(props.location.state.module)
    }, [])

    // Set noOFQuestion form input to state.
    function onQuestionCountChange(e){
        const value = e.target.value.replace(/[^\d]/,'');

        if(parseInt(value) !== 0) {
            setNewQuestionCount(value)
        }
        
    }

    // API call to change number of questions for a module.
    function onSubmit(e){
        e.preventDefault();
        async function changeNoOfQuestions(){
            const response = await microcredapi.post(`/module/${module.moduleId}/edit/${newQuestionCount}`)
            console.log(response.data);
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
            <h1 id="module-heading">Module Edit</h1>
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
                <Link key={Date.now()} type="button" className="btn btn-primary align-button-right" onClick={(e) => onSubmit(e)}> Submit</Link>
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
