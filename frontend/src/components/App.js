import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "./templates/Header";
import Module from "./modules/Module"
import Login from "./Login";
import Unit from './units/Unit'
import StaffDashboard from './dashboards/StaffDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

import "../style.css";
import CourseList from "./courses/CourseList";
import CourseDetail from "./courses/CourseDetail";
import FinalMarkForm from './courses/FinalMarkForm'
import StudentList from "./Staff/StudentList";
import StudentDetail from "./Staff/StudentDetail";
import StudentCreate from "./Staff/StudentCreate"

import useToken from './useToken';
import QuestionList from "./questions/QuestionList";
import QuestionCreate from "./questions/QuestionCreate";

const App = () => {

  const [userId, setUserId] = useState()
  console.log(userId);
  useEffect(() => {
    setUserId(window.localStorage.getItem('userId'))
  }, [])

  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

  function getDate(){
    return Date.now().toString()
  };

  return (
    <div>
      <BrowserRouter>
        <Header />
        <div className="container">
        <Switch>
          <Route path="/question/add" component={QuestionCreate} />
          <Route path="/questions" component={QuestionList} />
          <Route path="/courses/staff/:staffId" component={CourseList} />
          <Route path="/staffhome" component={StaffDashboard} />
          <Route path="/courses/:courseId/final/:studentId" component={FinalMarkForm} />
          <Route path="/courses/:courseId" component={CourseDetail} />
          <Route path="/unit/:unitId" component={Unit} />
          <Route path="/student/create" component={StudentCreate} />
          <Route path="/student/:studentId" component={StudentDetail} />
          <Route path="/students" component={() => <StudentList key={getDate()} />} />
          <Route path="/module/:moduleId" component={Module} />      
          <Route exact path="/" component={window.localStorage.getItem('isStaff') === "true" ? () => <StaffDashboard key={getDate()} /> : () => <StudentDashboard key={getDate()} />} />
        </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
