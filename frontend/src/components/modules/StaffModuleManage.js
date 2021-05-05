import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import FlashMessage from 'react-flash-message'

import microcredapi from '../../apis/microcredapi'
import '../../style.css'


const StaffModuleManage = (props) => {

    // State and history
    const history = useHistory()

    const [courses, setCourses] = useState()
    const [modules, setModules] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState(true)
    const [mounted, setMounted] = useState(false)

    // API calls before the component is mounted.
    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!courses){
                getCourses()
            }
        }
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(!selectedCourse){
                setModules({})
            }
            getModules(selectedCourse)
        }
        return () => {
            mounted = false
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
            setModules(response.data.modules)
        })
    }

    async function manageModule(type, moduleId){
        const callType = type
        let response;
        try {
            response = await microcredapi.get(`/module/${moduleId}/${callType}`)
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
            console.log(error);
        }
    }

    // Set selected course into state

    function onCourseSelect(unitId = undefined) {
        if(unitId){
            setSelectedCourse(unitId)
            window.localStorage.setItem('selectedCourse', unitId)
        }
        setSelectedCourse(unitId)
    }

    function renderCourseOptions() {
        return courses.map(course => {
            return(
                <option key={course.unitId} defaultValue={course.unitId} onClick={() => onCourseSelect(course.unitId)}>{course.unitName}</option>
            )
        })
    }
    // function renderCourseOptions() {
    //     return courses.map(course => {
    //         return(
    //             <div>
    //                 <option key={course.unitId} defaultValue={course.unitId} onClick={() => onCourseSelect(course.unitId)}>{course.unitName}</option>
    //                 {/* <button type="button" class="btn btn-primary" value={'t'} onClick={() =>onCourseSelect(course.unitId)}>{course.unitName}</button> */}
    //             </div>
                
    //         )
    //     })
    // }

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
                        <label className="visually-hidden" for="inlineFormSelectPref">Preference</label>
                        <select className="form-select" id="inlineFormSelectPref">
                        <option key="placeholder" selected id="placeholder-course" onClick={() => onCourseSelect()}>Select a Course</option>
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
                    <td scope="row">{module.moduleId}</td>
                    <td scope="row">{module.moduleName}</td>
                    <td>{module.noOfQuestions}</td>
                    <td>{module.published == true ? 'Published' : 'Unpublished'}</td>
                    <td>{`${module.weight}`}</td>
                    <td>
                        {module.published == false ? 
                            (
                                <div className="d-flex">
                                    <Link to={`/module/edit/${module.moduleNo}`} class="btn btn-warning  flex-fill" style={{marginRight: '1em'}}>Edit</Link>
                                    <button type="button" class="btn btn-success flex-fill" onClick={() => manageModule('publish', module.moduleId)}>Publish</button>
                                </div>
                            )
                        : 
                        <div className="d-flex">
                            <button type="button" class="btn btn-danger flex-fill" onClick={() => manageModule('unpublish', module.moduleId)}>Unpublish</button>
                        </div>
                        }
                    </td>
                </tr>
                )
            })
        } catch (error) {
            console.log(error);
        }
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
                <FlashMessage duration={80000}>
                <div className="my-5 text-center">
                <strong className="alert alert-danger">{error.message}</strong>
                </div>
                </FlashMessage>:
            ''
            }
            </section>
            <section className="pb-5">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th># of Questions</th>
                            <th>Publish</th>
                            <th>Weight</th>
                            <th style={{width:'5%'}}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules ? renderModules() : ''}
                        
                    </tbody>
                </table>
            </section>
            
        </div>
    )
}

export default StaffModuleManage
