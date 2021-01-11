import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Navbar from './components/navbar/navbar.js';
import Viewer from './components/viewer/viewer.js'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Navbar />

      <Switch>
        <Route path="/test">
          <p>Test2</p>
        </Route>
        <Route path="/">
          <Viewer />
        </Route>
      </Switch>
    </Router>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
