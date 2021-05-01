import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import InlineSearchForm from '../templates/InlineSearchForm'
class StaffDashboard extends Component {

  renderCard(url, cardTitle, cardDescription, path){
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

  render() { 
    return (
      
      <div className="jumbotron align-center">
         <section>
           <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
           </div>
           <div className="d-flex">
            {this.renderCard("https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80%201053w,%20", "Students", "View, update and create student records.", "/manage/students")}
            {this.renderCard("https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1275&q=80", "Modules", "View and manage modules for your courses.", "/manage/modules")}
            {this.renderCard("https://images.unsplash.com/photo-1557318041-1ce374d55ebf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80 1000w", "Questions", "View, create and delete questions.", "/manage/questions")}
           </div>
         </section>
      </div>
  )
  }
}

export default StaffDashboard
