import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'

const ModuleAttempts = (props) => {
    // Set state variables for the component
    const [courses, setCourses] = useState();
    const [selectedCourse, setSelectedCourse] = useState();
    const [modules, setModules] = useState();
    const [selectedModule, setSelectedModule] = useState();

    // Set state before component mount
    useEffect(() => {
        return () => {
        setSelectedCourse({})
        setSelectedModule({})
        }
    }, [])

    // API call to get data
    useEffect(() => {
        async function getCourses() {
        const units = await microcredapi
            .get(`/unit/${window.localStorage.getItem("userId")}`)
            .then((response) => response.data.units);
        setCourses(units);
        
        }
        getCourses();
    }, []);

    useEffect(() => {
        async function getModules() {
        await microcredapi
            .get(`module/${selectedCourse}`)
            .then((response) => setModules(response.data.modules));
        } 
        try {
        window.localStorage.setItem('selectedCourse',selectedCourse)
        getModules();
        } catch (error) {
        
        }
    }, [selectedCourse]);

      // Render units as options on the webpage
  function renderUnitOptions() {
    return courses.map((course) => {
      return (
        <option key={course.unitId} value={course.unitId}>
          {course.unitName}
        </option>
      );
    });
  }

    // Render modules as options in the dropdown of the search form
    function renderModuleOptions() {
        return modules.map((_module) => {
        return (
            <option key={_module.moduleId} value={_module.moduleId} disabled={_module.unpublished}>
            {_module.moduleName}
            </option>
        );
        });
    }

    function renderUnitModuleInput(){
        return (
            <div className="row row-cols-lg-auto g-3 align-items-center py-2">
            <div className="input-group col-lg-5">
              <select
                className="form-select"
                id="course"
                onChange={(e) =>
                  setSelectedCourse(
                    e.target.options[e.target.selectedIndex].value
                  )
                }
                defaultValue={0}
              >
                <option>Select a Course</option>
                {courses ? renderUnitOptions() : <option>Loading...</option>}
              </select>
            </div>
    
            <div className="input-group col-lg-5">
              <select className="form-select" id="course"
                onChange={(e) =>
                  setSelectedModule(
                    e.target.options[e.target.selectedIndex].value
                )
                }
                defaultValue={0}
                >
                <option>Select a module</option>
                {modules ? renderModuleOptions() : <option>Loading...</option>}
              </select>
            </div>
          </div>
        )
    }

    // Render the page elements 
    return (
      
      <div className="jumbotron align-center">
         <section>
           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h1">Module Attempts</h1>
           </div>
           <div className="my-4">
            <h6>Unit/Module Selection</h6>
                {renderUnitModuleInput()}
            </div>
            <div className="mt-4">
            <div className="col-sm-12">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Selected Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
      </div>
         </section>
      </div>
    )
}

export default ModuleAttempts
