import React, {useState,useEffect} from 'react'
import { useHistory } from 'react-router'
import microcredapi from '../../apis/microcredapi'
import InlineSearchForm from '../templates/InlineSearchForm'

function StaffModuleManage() {

    const history = useHistory()

    const [courses, setCourses] = useState()
    const [modules, setModules] = useState()
    const [selectedCourse, setSelectedCourse] = useState()

    useEffect(() => {
        if(!courses){
            getCourses()
        }
        if(selectedCourse){
            getModules(selectedCourse)
        }
    }, [selectedCourse])


    async function getCourses() {
        return await microcredapi.get(`/unit/${window.localStorage.getItem('userId')}`).then(response => {
            setCourses(response.data.units);
        })
    }

    async function getModules(unitId) {
        const response = await microcredapi.get(`module/${unitId}`).then(response => {
            setModules(response.data.modules)
        })
    }

    async function publishModule(moduleId){
        const response = await microcredapi.get(`/module/${moduleId}/publish`)
        history.replace('/manage/modules')
    }

    async function unPublishModule(moduleId){
        const response = await microcredapi.get(`/module/${moduleId}/unpublish`)
    }

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
                        <button type="button" class="btn btn-success" onClick={() => publishModule(module.moduleId)}>Publish</button>
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
                    {modules ? renderModules() : <tr><td colspan="6" className="p-5 text-center">Please choose a course</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

export default StaffModuleManage
