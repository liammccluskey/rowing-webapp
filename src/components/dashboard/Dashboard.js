
import React, { useEffect, useState, useRef } from "react"
import MainHeader from "../headers/MainHeader"
import Sidebar from '../headers/Sidebar'
import Calendar from './Calendar'
import UserInfoCard from './UserInfoCard'
import ClubsInfoCard from './ClubsInfoCard'
import NewSessionForm from './NewSessionForm'
import { useAuth } from "../../contexts/AuthContext"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import Loading from '../misc/Loading'
import axios from "axios"
import moment from 'moment'

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
    const [todaySessions, setTodaySessions] = useState([])
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
        const today = moment()
        setTodaySessions(res.data.filter( session => today.isSame( new Date(session.startAt), 'day' )))
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
            <MainHeader style={{position: 'sticky', top: '0'}} />
            <br />
            <div 
                className='main-container d-flex jc-flex-start ai-flex-start' 
                style={{gap: '100px', padding: '0px 100px', marginBottom: '100px'}}
            >
                <div style={{ flex: 1}} >
                    <div>
                        <h2 >Today's Workouts</h2>
                        <br />
                        <NewSessionForm 
                            setShowSessionForm={setShowSessionForm}
                            showSessionForm={showSessionForm}
                            fetchSessions={fetchSessions}
                            myClubs={myClubs}
                        />
                        {loading ? 
                            <Loading />
                            :
                            <div
                                style={{
                                    display: 'grid', gap: '10px',
                                    gridTemplateColumns: 'repeat(3,1fr)',
                                    gridAutoRows: 'minmax(125px, auto)',
                                }}
                            >
                                {todaySessions.map(session => (
                                    <div 
                                        key={session._id} 
                                        onClick={()=>routeToSessionWithID(session._id)}
                                        style={{padding: '20px 20px'}}
                                        className='main-subcontainer'
                                    >
                                        <div 
                                            className='d-flex jc-flex-start ai-flex-start'
                                            style={{
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <img 
                                                style={{borderRadius: '5px'}}
                                                height='40px' width='40px' 
                                                src={session.associatedClubID === 'none' ?
                                                    currentUser.photoURL : 
                                                    myClubs.find(club=>club._id===session.associatedClubID).iconURL
                                                }
                                            />
                                            <h4 style={{
                                                color: 'var(--color-secondary)',
                                                display: 'inline'
                                            }}>
                                                {session.associatedClubID === 'none' ? 
                                                    currentUser.displayName 
                                                    :
                                                    myClubs.find(club=>club._id===session.associatedClubID).name
                                                }
                                            </h4>
                                        </div>
                                        <h4>{session.title} </h4>
                                        <br />
                                        <h3
                                            style={{
                                                
                                                float: 'right'
                                            }}
                                        >
                                            {moment(session.startAt).format('LT')}
                                        </h3>
                                    </div>  
                                ))}
                                <div
                                    className='main-subcontainer d-flex ai-center jc-center'
                                    style={{ padding: '20px 20px'}}
                                    onClick={() => setShowSessionForm(true)}
                                >
                                    <h4 style={{color: 'var(--tint-color)'}}>
                                        + New Workout
                                    </h4>
                                </div>
                            </div>
                        }
                    </div>

                    <br /><br /><br />

                    <h2 >Training Calendar</h2>
                    <Calendar sessions={mySessions}/>
                </div>
                <div>
                    <h2 >Quick Stats</h2>
                    <br />
                    <UserInfoCard style={{width:'325px', height: 'auto'}}/>
                    <br />
                    <ClubsInfoCard clubs={myClubs} style={{width:'325px', height: 'auto'}}/>
                </div>
                
            </div>
        </div>
        
    )   

}


/*
import React, { useEffect, useState, useRef } from "react"
import MainHeader from "../headers/MainHeader"
import Sidebar from '../headers/Sidebar'
import Calendar from './Calendar'
import UserInfoCard from './UserInfoCard'
import ClubsInfoCard from './ClubsInfoCard'
import NewSessionForm from './NewSessionForm'
import { useAuth } from "../../contexts/AuthContext"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import Loading from '../misc/Loading'
import axios from "axios"
import moment from 'moment'

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
    const [todaySessions, setTodaySessions] = useState([])
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
        const today = moment()
        setTodaySessions(res.data.filter( session => today.isSame( new Date(session.startAt), 'day' )))
    }

    function handleToggleMode() {
        console.log("dashboard: did toggle mode change")
        setIsDarkMode(currState => !currState)
    }

    function routeToSessionWithID(sessionID) {
        history.push(`/sessions/${sessionID}`)
    }

    return (
        <div style={{height: '100vh'}}>
            <MainHeader />
            <div className='main-container d-flex jc-flex-start ai-flex-start' style={{gap: '25px', padding: '0px 25px'}}>
                <div>
                    <br />
                    <UserInfoCard style={{width:'250px', height: 'auto'}}/>
                </div>
                
                <div style={{ flex: 1, height: '100vh', overflow: 'scroll'}}>
                    <br />
                    <div className='float-container' style={{padding: '15px 20px'}}>
                        <div className='d-flex jc-space-between ai-center'>
                            <h3 >Today's Workouts</h3>
                            <button onClick={() => setShowSessionForm(true)} className='clear-btn-secondary'>New Workout</button>
                        </div><br />
                        <NewSessionForm 
                            setShowSessionForm={setShowSessionForm}
                            showSessionForm={showSessionForm}
                            fetchSessions={fetchSessions}
                            myClubs={myClubs}
                        />
                        {loading ? <Loading /> : !todaySessions.length ? 
                        <p style={{color: 'var(--color-secondary', padding: '15px 0px', textAlign: 'center'}}>
                            You have no workouts scheduled for today
                        </p> :
                            <div style={{ borderRadius: '5px', border: '1px solid var(--bc)'}} >
                                {todaySessions.map(session => (
                                    <div 
                                        key={session._id} 
                                        className='main-subcontainer' 
                                        onClick={()=>routeToSessionWithID(session._id)}
                                        style={{padding: '20px 20px'}}
                                    >
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
                                                {moment(session.startAt).calendar()}
                                            </p>
                                        </div>
                                    </div>  
                                ))}
                            </div>
                        }
                    </div>
                    <br />
                    <div className='float-container' style={{padding: '15px 20px', marginBottom: '100px'}}>
                        <h3 >Training Calendar</h3>
                        <Calendar sessions={mySessions}/>
                    </div>
                </div>
                <div>
                    <br />
                    <ClubsInfoCard clubs={myClubs} style={{width:'250px', height: 'auto'}}/>
                </div>
            </div>
        </div>
        
    )   

}
*/
