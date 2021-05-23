import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FlashMessage from 'react-flash-message'

import microcredapi from '../../apis/microcredapi'
import '../../style.css'


const StaffModuleManage = (props) => {

    // State and history
    const [courses, setCourses] = useState()
    const [modules, setModules] = useState()
    const [availableQuestions, setAvailableQuestions] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [, setUpdating] = useState(false)
    const [error, setError] = useState(true)
    const [mounted, setMounted] = useState(true)
    const [ModuleTableData, setModuleTableData] = useState()

    // API calls before the component is mounted.
    useEffect(() => {
        getCourses()
    }, [])

    useEffect(() => {
        if(mounted){
            getModules(selectedCourse)
            setModuleTableData(renderModules())
        }
        return () => {
            setMounted(false)
        }
    }, [selectedCourse])
    
    // api calls to get data
    async function getCourses() {
        return await microcredapi.get(`/unit/${window.localStorage.getItem('userId')}`).then(response => {
            setCourses(response.data.units);
        })
    }
    
    async function getModules(unitId) {
        return await microcredapi.get(`module/${unitId}`).then(response => {
            setAvailableQuestions(response.data.availableQuestions);
            setModules(response.data.modules);
        })
    }

    async function manageModule(type, moduleId){
        const callType = type
        let response;
        try {
            response = await microcredapi.post(`/module/${moduleId}/${callType}`)
            if (response.data.message) {
                setError({status: true, message: response.data.message})
                setTimeout(() => {
                    setError({status: false, message: undefined})
                }, 5000);
            } else if (response.data.success) {
                setUpdating(true)
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }

        } catch (error) {
            
        }
    }

    // Set selected course into state
    function renderCourseOptions() {
        return courses.map(course => {
            return(
                <option key={course.unitId} value={course.unitId}>{course.unitName}</option>
            )
        })
    }

    // Show the search form on the page
    function renderSearchForm() {
        return (
            <div>
                <h5>Selection Area</h5>
                {/* <div className="d-flex">
                    {courses ? renderCourseOptions() : 'Loading'}
                </div> */}
                <form className="row row-cols-lg-auto g-3 align-items-center py-2">
                    <div className="col-lg-12">
                        <label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</label>
                        <select 
                        className="form-select" 
                        id="inlineFormSelectPref"
                        onChange={(e) =>
                            setSelectedCourse(
                                e.target.options[e.target.selectedIndex].value
                            )
                        }
                        defaultValue={0}
                        >
                        <option key="placeholder" id="placeholder-course">Select a Course</option>
                        {courses ? renderCourseOptions() : <option>Loading</option>}
                        </select>
                    </div>       
                </form>
            </div>
        )
    }

    // Render modules after a course has been selected.
    function renderModules() {
        try {
            return modules.map(module => {
                return (
                    <tr key={module.moduleNo}>
                    <td>{module.moduleId}</td>
                    <td>{module.moduleName}</td>
                    <td>{module.noOfQuestions}</td>
                    <td>{getAvailableQuestions(module.moduleId)}</td>
                    
                    <td>{module.published === true ? 'Published' : 'Unpublished'}</td>
                    <td>{`${module.weight}`}</td>
                    <td>
                        {module.published === false ? 
                            (
                                <div className="d-flex">
                                    <Link to={{pathname:`/module/edit/${module.moduleNo}`, state:{module}}} className="btn btn-warning  flex-fill" style={{marginRight: '1em'}}>Edit</Link>
                                    <button type="button" className="btn btn-success flex-fill" onClick={() => manageModule('publish', module.moduleId)}>Publish</button>
                                </div>
                            )
                        : 
                        <div className="d-flex">
                            <button type="button" className="btn btn-danger flex-fill" onClick={() => manageModule('unpublish', module.moduleId)}>Unpublish</button>
                        </div>
                        }
                    </td>
                </tr>
                )
            })
        } catch (error) {
            
        }
    }

    function getAvailableQuestions(moduleNo){
        return availableQuestions[moduleNo]
    }

    return (
        <div className="align-center">
            <section className="pb-5">
                <h1>Module Management</h1>
            </section>
            <section>
            {renderSearchForm()}
            </section>
            <section>
            {
                error.status ?
                <FlashMessage duration={8000}>
                <div className="my-5 text-center">
                <p className="alert alert-danger text-break">{error.message}</p>
                </div>
                </FlashMessage>:
            ''
            }
            </section>
            <section className="pb-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Questions in quiz</th>
                            <th>Question Bank Size</th>
                            <th>Publish</th>
                            <th>Weight</th>
                            <th style={{width:'5%'}}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules && modules.length > 0 ? renderModules() : <tr><td colSpan="6" className="p-5 text-center">No modules for the selected course</td></tr>}
                        
                    </tbody>
                </table>
            </section>
            
        </div>
    )
}

export default StaffModuleManage
