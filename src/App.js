import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'
import Session from "./components/session/Session"
import Statistics from './components/training/Statistics'
import Activity from './components/training/Activity'

import Clubs from './components/explore/Clubs'
import Sessions from './components/explore/Sessions'

import Account from './components/settings/Account'
import Profile from './components/settings/Profile'
import Preferences from './components/settings/Preferences'

import CreateClub from './components/CreateClub'
import Club from './components/Club'

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

                <PrivateRoute path='/training/statistics' component={Statistics} />
                <PrivateRoute path='/training/activity' component={Activity} />

                <PrivateRoute path='/settings/account' component={Account} />
                <PrivateRoute path='/settings/profile' component={Profile} />
                <PrivateRoute path='/settings/preferences' component={Preferences} />

                <PrivateRoute path='/explore/clubs' component={Clubs} />
                <PrivateRoute path='/explore/sessions' component={Sessions} />

                <PrivateRoute path='/club-create' component={CreateClub} />
                <PrivateRoute path='/clubs/:clubURL' component={Club} />

                <PrivateRoute path='/sessions/:sessionID' component={Session} />
              </Switch>
            </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
