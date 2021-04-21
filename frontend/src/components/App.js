import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "./templates/Header";
import Module from "./modules/Module"
import Login from "./Login";
import Home from './Home'
import Unit from './units/Unit'
import StaffDashboard from './dashboards/StaffDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

import "../style.css";
import StudentList from "./Staff/StudentList";
import StudentDetail from "./Staff/StudentDetail";
import StudentCreate from "./Staff/StudentCreate"

import useToken from './useToken';

const App = () => {

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
        <Switch>
          <Route path="/unit/:unitId" component={Unit} />
          <Route path="/student/create" component={StudentCreate} />
          <Route path="/student/:studentId" component={StudentDetail} />
          <Route path="/students" component={() => <StudentList key={getDate()} />} />
          <Route path="/module/:moduleId" component={Module} />
          <Route path="/home" component={Home} />
          <Route path="/dashboard/student" component={StudentDashboard} />
          <Route path="/dashboard/staff" component={StaffDashboard} />
          
          <Route exact path="/" component={window.localStorage.getItem('isStaff') ? StaffDashboard : StudentDashboard} />

        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
