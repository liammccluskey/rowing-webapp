import React, { useEffect, useState, useRef } from "react"
import MainHeader from "../headers/MainHeader"
import SubHeader from '../headers/SubHeader'
import Calendar from './Calendar'
import UserInfoCard from './UserInfoCard'
import NewSessionForm from './NewSessionForm'
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
            <div className='main-container d-flex jc-flex-start ai-flex-start' >
                <UserInfoCard style={{marginRight: '50px', width:'250px', height: 'auto'}}/>
                <div style={{ flex: 1}}>
                    <div className='d-flex jc-space-between ai-center'>
                        <h3 >Today's Workouts</h3>
                        <button onClick={() => setShowSessionForm(true)} className='solid-btn-secondary'>New Workout</button>
                    </div><br />
                    <NewSessionForm 
                        setShowSessionForm={setShowSessionForm}
                        showSessionForm={showSessionForm}
                        fetchSessions={fetchSessions}
                        myClubs={myClubs}
                    />
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
