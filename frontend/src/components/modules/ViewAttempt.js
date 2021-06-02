import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import microcredapi from '../../apis/microcredapi'
import { v4 as uuidv4 } from 'uuid';
import '../../style.css'

const ViewAttempt = (props) => {
    // Set state variables for the component
    

    // Render the page elements 
    return (
      
      <div className="jumbotron align-center">
         <section>
           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h1">View Attempt</h1>
           </div>
           
         </section>
      </div>
    )
}

export default ViewAttempt
