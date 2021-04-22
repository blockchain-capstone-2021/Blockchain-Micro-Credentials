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
            
        </div>
    )
}

export default StaffDashboard
