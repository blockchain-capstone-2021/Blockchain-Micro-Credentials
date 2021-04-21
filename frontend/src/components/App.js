import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Module from "./modules/Module"
import Login from "./Login";
import Home from './Home'

import "../style.css";
import CourseList from "./courses/CourseList";
import CourseDetail from "./courses/CourseDetail";
import StaffDashboard from "../Dashboards/StaffDashboard";

const App = () => {


  const [studentId, setStudentId] = useState()
  const [staffId, setStaffId] = useState()

  useEffect(() => {
    setStudentId('s3710669')
    setStaffId('e1234567')
    window.localStorage.setItem('studentId', 's3710669');
    window.localStorage.setItem('staffId', 'e1234567');
  }, [])

  return (
    <div>
      
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/courses/staff/:staffId" component={CourseList} />
          <Route path="/staffhome" component={StaffDashboard} />
          <Route path="/courses/:courseId" component={CourseDetail} />
          
          <Route path="/module/:moduleId" component={() => {return <Module moduleId={2} />}} />
          <Route path="/home" component={Home} />
          <Route exact path="/" component={Login} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
