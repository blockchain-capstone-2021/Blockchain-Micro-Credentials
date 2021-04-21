import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Module from "./modules/Module"
import Login from "./Login";
import Home from './Home'

import "../style.css";

const App = () => {

  // Create API call to authenticate user login details
  // TODO: Implement Browser/Hashrouter to allow route access control.

  const getModule = () => {
    // Make API call to get a module and pass it to the module prop
    
  }

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
