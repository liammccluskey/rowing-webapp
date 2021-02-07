import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import Session from "./components/Session"

import Clubs from './components/explore/Clubs'
import Sessions from './components/explore/Sessions'

import Account from './components/account/Account'
import Settings from './components/account/Settings'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
            <ThemeProvider>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <PrivateRoute path="/dashboard" component={Dashboard} />

                <PrivateRoute exact path='/account' component={Account} />
                <PrivateRoute path='/account/settings' component={Settings} />

                <PrivateRoute path='/explore/clubs' component={Clubs} />
                <PrivateRoute path='/explore/sessions' component={Sessions} />

                <PrivateRoute path='/session/:sessionID' component={Session} />
              </Switch>
            </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
