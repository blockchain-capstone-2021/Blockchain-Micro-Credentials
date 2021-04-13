import React from 'react'
import { Link } from 'react-router-dom'

const Unit = ({unitId, unitName}) => {
    return (
        <div>
            <div className="card" style={{width: '18rem'}}>
            <div className="card-body">
                <h5 className="card-title">{unitId}</h5>
                <p className="card-text">{unitName}</p>
                <Link to={`/unit/${unitId}`} className="btn btn-primary">Open Course</Link>
            </div>
            </div>
        </div>
    )
}

export default Unit
