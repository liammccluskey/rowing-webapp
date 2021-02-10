import React, { useEffect, useState, useRef } from "react"
import MainHeader from "./headers/MainHeader"
import SubHeader from './headers/SubHeader'
import { useAuth } from "../contexts/AuthContext"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import Loading from './misc/Loading'
import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function Dashboard() {
    const { currentUser, signOut } = useAuth()
    const history = useHistory()
    const location = useLocation()
    const { isDarkMode, setIsDarkMode, companyName } = useTheme()
    const [loading, setLoading] = useState(true)
    const [sessions, setSessions] = useState([])
    const sessionHostNameRef = useRef()
    const sessionTitleRef = useRef()

    useEffect(async () => {
        async function fetchData() {
            const res = await api.get('/sessions')
            setSessions(res.data)
            setLoading(false)
        }
        fetchData()
    }, [])

    function handleSignOut() {
        signOut()
            .then(() => {
                console.log("did sign out")
                history.push("/")
            })
            .catch((e) => window.alert(e.message))
    }

    function handleToggleMode() {
        console.log("dashboard: did toggle mode change")
        setIsDarkMode(currState => !currState)
    }

    async function handleCreateSession(e) {
        e.preventDefault()
        console.log("Did create session")
        console.log(`Session Host Name: ${sessionHostNameRef.current.value} \n Session Title: ${sessionTitleRef.current.value}`)
        try {
            const res = await api.post('/sessions', {
                title: sessionTitleRef.current.value,
                hostName: sessionHostNameRef.current.value
            })
            routeToSessionWithID(res.data._id)
        } catch(err) {
            console.log(err)
        }
    }

    function routeToSessionWithID(sessionID) {
        history.push(`/session/${sessionID}`)
    }

    return (
        <div>
            <MainHeader />
            <SubHeader 
                path={location.pathname} 
                items={[
                    {title: 'Activity', path: '/'},
                    {title: 'History', path: ''}
                ]}
                subPath='/'
            />
            <div className='main-container'>
                <div className='d-flex jc-space-between ai-center'>
                    <h2 style={{fontWeight: '500'}}>Today</h2>
                    <button className='solid-btn'>+ New Session</button>

                </div>
                
                <h2 style={{fontWeight: '500'}}>Upcoming</h2>
                
                <br /><br />
                <h2 style={{fontWeight: '500'}}>Join a Session</h2>
                {loading ? <Loading /> : (
                <div>
                    <div>
                        {sessions.map(session => 
                            <div key={session._id} className='main-subcontainer' onClick={()=>routeToSessionWithID(session._id)}>
                                <h4>{session.title}</h4>
                                <p>{`Host Name: ${session.hostName}`}</p>
                                <p>{`Members: ${session.members.map(m=>m.name).join(', ')}`}</p>
                            </div>
                        )}
                    </div>
                    {console.log(currentUser ? "mounting dashboard : with user" : "mounting dashboard : NULL user")}
                    <p>Welcome to the dashboard
                        {currentUser ? currentUser.displayName : "(Error: no currentUser)"}
                    </p>
                    <button onClick={handleToggleMode}>
                        {isDarkMode ? "Dark Mode" : "Light Mode" }
                    </button>
                    <button onClick={handleSignOut}>Log Out</button>
                </div>)}

                <h2 style={{fontWeight: '500'}}>Create a Session</h2>
                <form onSubmit={handleCreateSession}>
                    <label style={{margin: '0px 0px'}}>
                        Your Name:
                        <input type="text" ref={sessionHostNameRef} required/>
                    </label>
                    <label>
                        Session Title:
                        <input type='text' ref={sessionTitleRef} required/>
                    </label>
                    <input className='solid-btn' style={{margin: '0px 30px'}} type='submit' />
                </form>
                
            </div>
        </div>
        
    )   

}