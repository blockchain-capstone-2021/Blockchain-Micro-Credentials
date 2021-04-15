import React, { Component } from 'react'
import {Link} from 'react-router-dom'
class StaffDashboard extends Component {

  renderCard(url, cardTitle, cardDescription, path){
    return (
      <div class="card mx-2" style={{width: "18rem"}}>
        <img src={url} class="card-img-top" alt="..." style={{height:"190px", width:"286px"}} />
        <div class="card-body">
          <h5 class="card-title">{cardTitle}</h5>
          <p class="card-text">{cardDescription}</p>
          <Link to={path} className="btn btn-primary">Go</Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
         <section>
           <h1>Portals</h1>
           <div className="d-flex">
            {this.renderCard("https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80%201053w,%20", "Students", "View, update and create student records", "/students")}
            {this.renderCard("https://images.unsplash.com/photo-1557318041-1ce374d55ebf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80 1000w", "Questions", "View, update, create and delete questions.", "/questions")}
           </div>
         </section>
      </div>
  )
  }
}

export default StaffDashboard
