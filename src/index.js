import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import Login from './views/login.jsx';
import AdminLayout from "layouts/Admin.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" render={props => <Login {...props} />} />   
      <Route path="/admin" render={props => <AdminLayout {...props} />} />      
      <Redirect from="/" to="login" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
