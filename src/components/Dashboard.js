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
    const { currentUser } = useAuth()
    const { isDarkMode, setIsDarkMode, companyName } = useTheme()
    const history = useHistory()
    const location = useLocation()

    const [myClubs, setMyClubs] = useState([])
    const [mySessions, setMySessions] = useState([])
    const [loading, setLoading] = useState(true)

    const [showSessionForm, setShowSessionForm] = useState(false)
    const sessionTitleRef = useRef()
    const sessionDateRef = useRef()
    const sessionTimeRef = useRef()
    const sessionPrivacyRef = useRef()

    useEffect(() => {
        async function fetchData() {
            await fetchClubs()
            await fetchSessions()
            setLoading(false)
        }
        fetchData()
    }, [])

    async function fetchClubs() {
        const url = `/clubs/uid/${currentUser.photoURL}`
        const res = await api.get(url)
        setMyClubs(res.data)
    }

    async function fetchSessions() {
        const res = await api.get(`/sessions/active/uid/${currentUser.photoURL}`)
        setMySessions(res.data)
    }

    function handleToggleMode() {
        console.log("dashboard: did toggle mode change")
        setIsDarkMode(currState => !currState)
    }

    async function handleCreateSession(e) {
        e.preventDefault()
        console.log('did create session')
        const startAt = new Date(`${sessionDateRef.current.value}T${sessionTimeRef.current.value}`)
        const sessionData = {
            title: sessionTitleRef.current.value,
            hostName: currentUser.displayName,
            hostUID: currentUser.photoURL,
            startAt: startAt,
            isAccessibleByLink: sessionPrivacyRef.current.value === 'link',
            associatedClubID: ['link', 'self'].includes(sessionPrivacyRef.current.value) ? 'none' : sessionPrivacyRef.current.value
        }
        try {
            const res = await api.post('/sessions', sessionData)
            setTimeout(() => {
                setShowSessionForm(false)
                fetchSessions()
            }, 1000);
            
        } catch(err) {
            console.log(err)
        }
    }

    function routeToSessionWithID(sessionID) {
        history.push(`/sessions/${sessionID}`)
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
                    <h2 style={{fontWeight: '500'}}>Today's Workouts</h2>
                    <button onClick={() => setShowSessionForm(true)}className='solid-btn'>New Workout</button>
                </div>
                <div className='float-container'
                    style={{
                        opacity: showSessionForm ? '100%':'0%',
                        height: showSessionForm ? '375px': '0px',
                        marginBottom: '30px',
                        transition: '0.3s',
                        }}
                >
                    <br />
                    <form onSubmit={handleCreateSession}>
                        <label>
                            Title <br />
                            <input style={{width: '300px'}} type='text' ref={sessionTitleRef} required/>
                        </label> <br /><br />

                        <div className='d-flex jc-flex-start ai-center'>
                            <label style={{marginRight:'30px'}}>
                                Date <br />
                                <input ref={sessionDateRef} type='date' required/>
                            </label>
                            <label>
                                Start Time <br />
                                <input ref={sessionTimeRef} type='time' required/>
                            </label>
                        </div> <br />
                        <label >
                            Who can join <br />
                            <select ref={sessionPrivacyRef}>
                                <option value="self">Only Me</option>
                                <option value="link">Anyone with link</option>
                                {myClubs.map(club => (
                                    <option value={club._id}>{club.name}</option>
                                ))}
                            </select>
                        </label><br /><br /><br />
                        <div className='d-flex jc-space-between'>
                            <button  className='clear-btn-secondary' type='submit'>Create</button>
                            <button type='button' onClick={()=>setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                        </div>
                    </form>
                </div>
                {loading ? <Loading /> :
                    <div className='float-container'>
                        {mySessions.map(session => (
                            <div key={session._id} className='main-subcontainer' onClick={()=>routeToSessionWithID(session._id)}>
                                <div className='d-flex jc-space-between ai-center'>
                                    <div className='d-flex jc-flex-start'>
                                        {session.associatedClubID !== 'none' &&
                                            <img 
                                                style={{borderRadius: '5px'}}
                                                height='70px' width='70px' 
                                                src={myClubs.find(club=>club._id===session.associatedClubID).iconURL}
                                            />
                                        }
                                        <div style={{margin: '0px 10px'}}>
                                            <p style={{fontWeight: '600',margin: '0px 10px'}}>{session.title}</p>
                                            <p style={{margin: '0px 10px'}}>
                                                {`Host: ${session.hostName}`}
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{fontWeight: 500}}>
                                        { new Date(session.startAt).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>  
                        ))}
                    </div>
                }
                <h2 style={{fontWeight: '500'}}>Upcoming</h2>
            </div>
        </div>
        
    )   

}