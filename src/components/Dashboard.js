import React, { useEffect, useState, useRef } from "react"
import MainHeader from "./headers/MainHeader"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import axios from "axios"

const api = axios.create({
    baseURL: "https://rowingapp-api.herokuapp.com"
})
export default function Dashboard() {
    const { currentUser, signOut } = useAuth()
    const history = useHistory()
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
            <div className='main-container'>
                <h2>Create a Session</h2>
                <form onSubmit={handleCreateSession}>
                    <label style={{margin: '0px 30px'}}>
                        Your Name:
                        <input type="text" ref={sessionHostNameRef} required/>
                    </label>
                    <label>
                        Session Title:
                        <input type='text' ref={sessionTitleRef} required/>
                    </label>
                    <input style={{margin: '0px 30px'}} type='submit' />
                </form>
                <h2>Join a Session</h2>
                {loading ? (<h3>Loading</h3>) : (
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
                
            </div>
        </div>
        
    )   

}