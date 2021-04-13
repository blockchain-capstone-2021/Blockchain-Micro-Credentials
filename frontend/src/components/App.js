import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Module from "./modules/Module"
import Login from "./Login";
import Home from './Home'
import StaffDashboard from './dashboards/StaffDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

import "../style.css";
import Unit from "./units/Unit";

const App = () => {

  // Create API call to authenticate user login details
  // TODO: Implement Browser/Hashrouter to allow route access control.

  const getModule = () => {
    // Make API call to get a module and pass it to the module prop
    
  }
  window.localStorage.setItem('studentId', 's3710669');

  return (
    <div>
      
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/unit/:unitId" component={Unit} />
          <Route path="/module/:moduleId" component={() => {return <Module />}} />
          <Route path="/home" component={Home} />
          <Route path="/dashboard/student" component={StudentDashboard} />
          <Route path="/dashboard/staff" component={StaffDashboard} />
          <Route exact path="/" component={Login} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
