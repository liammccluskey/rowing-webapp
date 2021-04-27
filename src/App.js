import './App.css'
import React, {useEffect} from "react"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Landing from "./components/Landing"
import Login from "./components/Login"
import Register from "./components/Register"
import PasswordReset from './components/PasswordReset'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MessageProvider } from './contexts/MessageContext'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'
import Session from "./components/session/Session"
import Statistics from './components/training/Statistics'
import Activity from './components/training/Activity'

import Clubs from './components/explore/Clubs'
import Athletes from './components/explore/Athletes'

import Settings from './components/settings/Settings'

import CreateClub from './components/CreateClub'
import EditClub from './components/club/EditClub'
import Club from './components/club/Club'
import Members from './components/club/Members'

import Athlete from './components/athlete/Athlete'
import Following from './components/athlete/Following'

function App() {
  useEffect(() => {
    document.title = 'ergsync'
  })
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <MessageProvider>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path='/reset' component={PasswordReset} />
                <PrivateRoute path="/dashboard" component={Dashboard} />

                <PrivateRoute path='/training/statistics' component={Statistics} />
                <PrivateRoute path='/training/activity' component={Activity} />

                <PrivateRoute path='/settings' component={Settings} />

                <PrivateRoute path='/explore/clubs' component={Clubs} />
                <PrivateRoute path='/explore/athletes' component={Athletes} />

                <PrivateRoute path='/club-create' component={CreateClub} />
                <PrivateRoute path='/clubs/:clubURL/edit' component={EditClub} />
                <PrivateRoute path='/clubs/:clubURL/general' component={Club} />
                <PrivateRoute path='/clubs/:clubURL/members' component={Members} />

                <PrivateRoute exact path='/athletes/:userID' component={Athlete} />
                <PrivateRoute path='/athletes/:userID/following' component={Following} />


                <PrivateRoute path='/sessions/:sessionID' component={Session} />
              </Switch>
            </MessageProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
