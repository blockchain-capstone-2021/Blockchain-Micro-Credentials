import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'

const ModuleAttempts = () => {
    // Set state variables for the component
    const [modules, setModules] = useState();
    const [selectedModule, setSelectedModule] = useState();

    // Retrieve data from API


    // Render the page elements 
    return (
      
      <div className="jumbotron align-center">
         <section>
           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h1">Module Attempts</h1>
           </div>
         </section>
      </div>
  )
}

export default ModuleAttempts
