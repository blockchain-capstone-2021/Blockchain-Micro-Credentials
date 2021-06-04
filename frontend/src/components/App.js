import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "../style.css";
import Header from "./templates/Header";
import Login from "./login/Login";
import useToken from "./login/useToken";

import StaffDashboard from "./dashboards/StaffDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

import StudentProfile from "./student/StudentProfile";
import StaffStudentManage from "./student/StaffStudentManage";
import StudentMarkEntry from "./student/StudentMarkEntry";

import Module from "./modules/Module";
import StaffModuleManage from "./modules/StaffModuleManage";
import StaffModuleEdit from "./modules/StaffModuleEdit";
import Attempts from "./modules/ModuleAttempts";
import ViewAttempt from "./modules/ViewAttempt";
import Unit from "./units/Unit";

import StaffQuestionManage from "./questions/StaffQuestionManage";
import StaffQuestionView from "./questions/StaffQuestionView";
import StaffQuestionAdd from "./questions/StaffQuestionAdd";

const App = () => {

  const [, setUserId] = useState()
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
        <Route path="/manage/modules" key={getDate()} component={StaffModuleManage} />
        <Route path="/manage/questions" component={StaffQuestionManage} />
        <Route path="/student/:studentId/profile" component={StudentProfile} />
        <Route path="/question/create" component={StaffQuestionAdd} />
        <Route path="/question/:questionId" component={StaffQuestionView} />
        <Route path="/mark/:courseId/:studentId" component={StudentMarkEntry} />
        <Route path="/unit/:unitId" component={Unit} />
        <Route path="/module/edit/:moduleId" component={StaffModuleEdit} />
        <Route path="/module/attempts/:studentId/:courseId" component={Attempts} />
        <Route path="/module/attempt/:studentId/:courseId/:moduleId/:attemptNo" component={ViewAttempt} />
        <Route path="/module/:moduleId" component={Module} />
        <Route exact path="/" component={window.localStorage.getItem('isStaff') === 'true' ? () => <StaffDashboard key={getDate()} /> : () => <StudentDashboard key={getDate()} />} />
        </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
