import React, { useEffect, useState, useRef } from "react"
import MainHeader from "../headers/MainHeader"
import SubHeader from '../headers/SubHeader'
import Calendar from './Calendar'
import { useAuth } from "../../contexts/AuthContext"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import Loading from '../misc/Loading'
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
        const url = `/clubs/uid/${currentUser.uid}`
        const res = await api.get(url)
        setMyClubs(res.data)
    }

    async function fetchSessions() {
        const res = await api.get(`/sessions/incomplete/uid/${currentUser.uid}`)
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
            hostUID: currentUser.uid,
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
            <div className='main-container d-flex jc-flex-start' >
                <div style={{marginRight: '60px'}}>
                    <div style={{width: '250px', height: 'auto', padding: '15px 15px'}} className='float-container'>
                        <div className='d-flex jc-flex-start ai-center'>
                            <img 
                                height='50px' width='50px' 
                                src={currentUser.photoURL} 
                                style={{borderRadius: '5px', marginRight: '10px'}}
                            />
                            <h3>{currentUser.displayName}</h3>
                        </div>
                        <br />
                        <table style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th style={{color: 'var(--color-secondary)'}}>Period</th>
                                    <th style={{color: 'var(--color-secondary)'}}>Meters Rowed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>This Week</td>
                                    <td style={{color: 'var(--tint-color)'}}>10k</td>
                                </tr>
                                <tr>
                                    <td>This Month</td>
                                    <td style={{color: 'var(--tint-color)'}}>100k</td>
                                </tr>
                                <tr>
                                    <td>This Year</td>
                                    <td style={{color: 'var(--tint-color)'}}>1 million</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <table style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th style={{color: 'var(--color-secondary)'}}>Event</th>
                                    <th style={{color: 'var(--color-secondary)'}}>Personal Record</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2k</td>
                                    <td style={{color: 'var(--tint-color)'}}>7:01</td>
                                </tr>
                                <tr>
                                    <td>5k</td>
                                    <td style={{color: 'var(--tint-color)'}}>19:36</td>
                                </tr>
                                <tr>
                                    <td>10k</td>
                                    <td style={{color: 'var(--tint-color)'}}>35:30</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ flex: 1}}>
                    <div className='d-flex jc-space-between ai-center'>
                        <h3 >Today's Workouts</h3>
                        <button onClick={() => setShowSessionForm(true)} className='solid-btn-secondary'>New Workout</button>
                    </div><br />
                    <div className='float-container'
                        style={{
                            opacity: showSessionForm ? '100%':'0%',
                            height: showSessionForm ? '410px': '0px',
                            marginBottom: showSessionForm ? '30px' : '0px',
                            transition: '0.3s',
                            padding: '0px 20px'
                            }}
                    >
                        <br />
                        <h3 style={{ textAlign: 'center'}}>Create a Workout</h3>
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
                                        <option value={club._id}>
                                            {club.name}
                                        </option>
                                    ))}
                                </select>
                            </label><br /><br /><br />
                            <div className='d-flex jc-space-between'>
                                <button  className='clear-btn-secondary' type='submit'>Create</button>
                                <button type='button' onClick={()=>setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                            </div>
                        </form>
                        <br />
                    </div>
                    {loading ? <Loading /> :
                        <div className='float-container' >
                            {mySessions.map(session => (
                                <div key={session._id} className='main-subcontainer' onClick={()=>routeToSessionWithID(session._id)}>
                                    <div className='d-flex jc-space-between ai-center'>
                                        <div className='d-flex jc-flex-start'>
                                            <img 
                                                style={{borderRadius: '5px'}}
                                                height='50px' width='50px' 
                                                src={session.associatedClubID === 'none' ?
                                                    currentUser.photoURL : 
                                                    myClubs.find(club=>club._id===session.associatedClubID).iconURL
                                                }
                                            />
                                            <div style={{margin: '0px 10px'}}>
                                                <h4 style={{margin: '0px 10px', marginBottom: '5px'}}>{session.title}</h4>
                                                <p style={{margin: '0px 10px', color: 'var(--color-secondary)'}}>
                                                    {`Host: ${session.hostName}`}
                                                </p>
                                            </div>
                                        </div>
                                        <p >
                                            { new Date(session.startAt).toLocaleTimeString([],{hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>  
                            ))}
                        </div>
                    }
                    <br /><br />
                    <h3 >Upcoming</h3>
                    <br />
                    <Calendar />
                    <br /><br />
                </div>
            </div>
        </div>
        
    )   

}