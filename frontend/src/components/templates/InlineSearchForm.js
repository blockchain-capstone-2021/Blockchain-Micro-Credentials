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
        <form className="row row-cols-lg-auto g-3 align-items-center py-2">
            <div className="col-lg-6">
                <label className="visually-hidden" for="inlineFormSelectPref">Preference</label>
                <select className="form-select" id="inlineFormSelectPref">
                    <option onClick={() => {props.onClickCourse(undefined)}} selected>Choose Course</option>
                    {courses ? renderCourses() : <option>Loading</option>}
                </select>
            </div>

            {
                modules ?
                <div className="col-lg-6">
                <label className="visually-hidden" for="inlineFormSelectPref">Preference</label>
                <select className="form-select" id="inlineFormSelectPref">
                    <option>Choose Module</option>
                    {renderModules()}
                </select>
            </div>:
            ""
            }

        </form>
    </div>
    )
}

export default InlineSearchForm
