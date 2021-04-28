import React, {useState, useEffect, useRef} from 'react'

const InlineSearchForm = (props) => {

    const [courses, setCourses] = useState()
    const [modules, setModules] = useState()

    useEffect(() => {
        setCourses(props.courses)
        async function getModules(){
            if(props.modules){
                await props.modules.then(response => {
                    setModules(response)
                })
            }
        }
        getModules()
    }, [])

    function renderCourses() {
        return courses.map(course => {
            return (
                <option key={course.unitId} defaultValue={course.unitId} onClick={() => {props.onClickCourse(course.unitId)}}>{course.unitName}</option>
            )
        })
    }

    function renderModules() {
        return modules.map(module => {
            return (
                <option key={module.moduleId} defaultValue={module.moduleId} >{module.moduleName}</option>
            )
        })
    }
    
    return (
    <div>
        <h5>Selection Area</h5>
        <form class="row row-cols-lg-auto g-3 align-items-center">
            <div class="col-lg-5">
                <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
                <select class="form-select" id="inlineFormSelectPref">
                    <option selected>Choose Course</option>
                    {courses ? renderCourses() : <option>Loading</option>}
                </select>
            </div>

            {
                modules ?
                <div class="col-lg-5">
                <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
                <select class="form-select" id="inlineFormSelectPref">
                    <option>Choose Module</option>
                    {renderModules()}
                </select>
            </div>:
            ""
            }

            <div class="col-12">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
    )
}

export default InlineSearchForm
