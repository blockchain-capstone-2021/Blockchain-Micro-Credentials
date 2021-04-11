import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Login from "./Login";
import Home from './Home'
import "../style.css";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/home" component={Home} />
          <Route exact path="/" component={Login} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
