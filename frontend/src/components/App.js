import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "../style.css";
import useToken from './useToken';

import Header from "./templates/Header";
import Module from "./modules/Module"
import Login from "./Login";
import Unit from './units/Unit'
import StaffDashboard from './dashboards/StaffDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

import StudentDetail from "./Staff/StudentDetail";
import StudentCreate from "./Staff/StudentCreate"

import QuestionList from "./questions/QuestionList";
import QuestionCreate from "./questions/QuestionCreate";

import StudentProfile from "./student/StudentProfile";
import StaffStudentManage from './student/StaffStudentManage'
import StudentMarkEntry from './student/StudentMarkEntry'

import StaffModuleManage from './modules/StaffModuleManage'
import StaffQuestionManage from './questions/StaffQuestionManage'

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
        <div className="side-menu">
        <Header />
        </div>
        <div className="container">
        <Switch>
        <Route path="/manage/students" component={StaffStudentManage} />
        <Route path="/manage/modules" component={StaffModuleManage} />
        <Route path="/manage/questions" component={StaffQuestionManage} />
        <Route path="/student/:studentId/profile" component={StudentProfile} />
        <Route path="/question/create" component={QuestionCreate} />
        <Route path="/question" component={QuestionList} />
        <Route path="/mark/:courseId/:studentId" component={StudentMarkEntry} />
        <Route path="/unit/:unitId" component={Unit} />
        <Route path="/student/create" component={StudentCreate} />
        <Route path="/student/:studentId" component={StudentDetail} />
        <Route path="/module/:moduleId" component={Module} />      
        <Route exact path="/" component={window.localStorage.getItem('isStaff') === 'true' ? () => <StaffDashboard key={getDate()} /> : () => <StudentDashboard key={getDate()} />} />
        </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
