import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'


const StaffDashboard = (props) => {

    const [staffId, setStaffId] = useState()
    useEffect(() => {
        setStaffId(window.localStorage.getItem('userId'))
    }, [])
    
    function renderCard(url, cardTitle, cardDescription, path){
        return (
          <div className="card mx-2" style={{width: "18rem"}}>
            <img src={url} className="card-img-top" alt="..." style={{height:"190px", width:"286px"}} />
            <div className="card-body">
              <h5 className="card-title">{cardTitle}</h5>
              <p className="card-text">{cardDescription}</p>
              <Link to={path} className="btn btn-primary">Go</Link>
            </div>
          </div>
        )
      }

    return (
        <div className="container">
            {renderCard("https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1275&q=80", "Courses", "View courses.", `/courses/staff/${staffId}`)}
        </div>
    )
}

export default StaffDashboard
