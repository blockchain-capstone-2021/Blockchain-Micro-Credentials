import React, {useState,useEffect} from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import InlineSearchForm from '../templates/InlineSearchForm'
import FlashMessage from 'react-flash-message'
import { Link } from 'react-router-dom'

function StaffModuleManage() {

    const history = useHistory()

    const [courses, setCourses] = useState()
    const [modules, setModules] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState(true)

    // Get modules if a course has been selected.
    useEffect(() => {
        getCourses()
        if(selectedCourse){
            getModules(selectedCourse)
        }
    }, [selectedCourse])

    // API call to get courses taught by employee
    async function getCourses() {
        return await microcredapi.get(`/unit/${window.localStorage.getItem('userId')}`).then(response => {
            setCourses(response.data.units);
        })
    }
    // API call to get modules for selected course
    async function getModules(unitId) {
        const response = await microcredapi.get(`module/${unitId}`).then(response => {
            setModules(response.data.modules)
        })
    }

    // Publish a module if conditions are met
    async function publishModule(moduleId){
        let response;
        setUpdating(true)
        try {
            response = await microcredapi.get(`/module/${moduleId}/publish`)
            if (response.data.message) {
                setError({status: true, message: response.data.message})
                setTimeout(() => {
                    setError({status: false, message: undefined})
                }, 5000);
            } else {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            
        } catch (error) {

        }
    }

    //unpublish a module if conditions are met
    async function unPublishModule(moduleId){
        let response;
        setUpdating(true)
        try {
            response = await microcredapi.get(`/module/${moduleId}/unpublish`)
            if (response.data.message) {
                setError({status: true, message: response.data.message})
                setTimeout(() => {
                    setError({status: false, message: undefined})
                }, 5000);
            } else {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Render method that return all module data in tabular form.
    function renderModules(){
        return modules.map(module => {
            return (
                <tr key={module.moduleNo}>
                    <td scope="row">{module.moduleId}</td>
                <td scope="row">{module.moduleName}</td>
                <td>{module.noOfQuestions}</td>
                <td>{module.published == true ? 'Published' : 'Unpublished'}</td>
                <td>{module.weight}</td>
                <td>
                    {module.published == false ? 
                        (
                            <div className="d-flex">
                                <Link to={`/module/edit/${module.moduleNo}`} style={{marginRight: '1em'}} class="btn btn-warning">Edit</Link>
                                <button type="button" class="btn btn-success" onClick={() => publishModule(module.moduleId)}>Publish</button>
                            </div>
                        )
                    : 
                    <button type="button" class="btn btn-danger" onClick={() => unPublishModule(module.moduleId)}>Unpublish</button>
                    }
                </td>
            </tr>
            )
        })
    }

    return (
        <div>
            <div className="pb-4">
                <h1 className="py-5">Modules Management</h1>
                {courses ? <InlineSearchForm courses={courses} onClickCourse={setSelectedCourse} selectedCourse={selectedCourse} /> : ""}
            </div>
            {
                error.status ?
                <FlashMessage duration={5000} className="alert alert-danger">
                <strong>{error.message}</strong>
                </FlashMessage>:
            ''
            }
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th># of Questions</th>
                        <th>Publish</th>
                        <th>Weight</th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        updating ?
                        <tr><td colspan="6" className="p-5 text-center">Module is updating</td></tr>:
                        modules ? renderModules() : <tr><td colspan="6" className="p-5 text-center">Please choose a course</td></tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default StaffModuleManage
