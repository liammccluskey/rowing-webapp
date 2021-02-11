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
    const sessionTitleRef = useRef()

    const [showSessionForm, setShowSessionForm] = useState(false)

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
        console.log(`Session Host Name: ${currentUser.displayName} \n Session Title: ${sessionTitleRef.current.value}`)
        try {
            const res = await api.post('/sessions', {
                title: sessionTitleRef.current.value,
                hostName: currentUser.displayName
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
                    <button onClick={() => setShowSessionForm(true)}className='solid-btn'>+ New Session</button>
                </div>
                <div 
                    style={{
                        opacity: showSessionForm ? '100%':'0%',
                        padding: '0px 20px',
                        borderRadius: '10px',
                        border: '1px solid var(--bc)',
                        backgroundColor: 'var(--bgc-light)',
                        height: showSessionForm ? '175px': '0px',
                        transition: '0.2s',
                        overflow: 'hidden'
                        }}
                >
                    <br />
                    <label>
                        Session Title <br />
                        <input style={{width: '300px'}} type='text' ref={sessionTitleRef} required/>
                    </label>
                    <br /><br />
                    <div className='d-flex jc-space-between'>
                        <button onClick={handleCreateSession} className='clear-btn-secondary'>Create</button>
                        <button onClick={()=>setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                    </div>
                </div>
                
                <h2 style={{fontWeight: '500'}}>Upcoming</h2>
                
                
            </div>
        </div>
        
    )   

}