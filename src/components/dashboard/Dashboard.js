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
            <br />
            <div 
                className='main-container d-flex jc-flex-start ai-flex-start' 
                style={{gap: '75px', padding: '0px 50px', marginBottom: '100px'}}
            >
                <div hidden={false}>
                    <UserInfoCard style={{width:'300px', height: 'auto'}}/>
                    <br />
                    <ClubsInfoCard clubs={myClubs} style={{width:'300px', height: 'auto'}}/>
                </div>
                <div style={{ flex: 1}} >
                    <div>
                        <div className='d-flex jc-space-between ai-center'>

                            <h2>Today's Workouts</h2>
                            <button className='clear-btn-secondary' onClick={() => setShowSessionForm(true)}>
                                Add Workout
                            </button>
                        </div>
                        <br />
                        <NewSessionForm 
                            setShowSessionForm={setShowSessionForm}
                            showSessionForm={showSessionForm}
                            fetchSessions={fetchSessions}
                            myClubs={myClubs}
                        />
                        {loading ? <Loading /> : 
                        <div>
                            <table style={{width: '100%'}} >
                                <thead>
                                    <tr style={{backgroundColor: 'var(--bgc)'}}>
                                        <th style={{color: 'var(--color)'}}>Host</th>
                                        <th style={{color: 'var(--color)'}}>Title</th>
                                        <th style={{color: 'var(--color)'}}>Starts At</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {todaySessions.map( (session, i) => (
                                    <tr key={i}
                                        onClick={() => routeToSessionWithID(session._id)}
                                    >
                                        <td className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                            <img style={{borderRadius: '5px'}} height='30px' width='30px' 
                                                src={session.associatedClubID === 'none' ?
                                                    currentUser.photoURL : 
                                                    myClubs.find(club=>club._id===session.associatedClubID).iconURL
                                                }
                                            />
                                            {session.associatedClubID === 'none' ? 
                                                currentUser.displayName 
                                                :
                                                myClubs.find(club=>club._id===session.associatedClubID).name
                                            }
                                        </td>
                                        <td>
                                            {session.title}
                                        </td>
                                        <td>
                                            {moment(session.startAt).format('LT')}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!todaySessions.length && 
                                <p style={{textAlign: 'center', padding: '15px 0px'}}>You have no workouts scheduled for today</p>
                            }
                        </div>}
                    </div>

                    <br /><br /><br />

                    <h2 >Training Calendar</h2>
                    <Calendar sessions={mySessions}/>
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
        <div>
            <MainHeader style={{position: 'sticky', top: '0'}} />
            <br />
            <br />
            <div 
                className='main-container d-flex jc-flex-start ai-flex-start' 
                style={{gap: '100px', padding: '0px 100px', marginBottom: '100px'}}
            >
                <div style={{ flex: 1}} >
                    <div>
                        <h2>Today's Workouts</h2>
                        <div className='d-flex jc-flex-end'>
                            <button className='clear-btn-secondary' onClick={() => setShowSessionForm(true)}>
                                Add Workout
                            </button>
                        </div>
                        <br />
                        <NewSessionForm 
                            setShowSessionForm={setShowSessionForm}
                            showSessionForm={showSessionForm}
                            fetchSessions={fetchSessions}
                            myClubs={myClubs}
                        />
                        {loading ? <Loading /> : 
                        <div className='float-container'>
                            <table style={{width: '100%'}}>
                                <thead>
                                    <tr style={{backgroundColor: 'var(--bgc-hover)'}}>
                                        <th>Host</th>
                                        <th>Title</th>
                                        <th>Starts At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaySessions.map( (session, i) => (
                                    <tr key={i} style={{borderBottom: '1px solid var(--bc)'}}>
                                        <td className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                            <img style={{borderRadius: '5px'}} height='40px' width='40px' 
                                                src={session.associatedClubID === 'none' ?
                                                    currentUser.photoURL : 
                                                    myClubs.find(club=>club._id===session.associatedClubID).iconURL
                                                }
                                            />
                                            <h4>
                                                {session.associatedClubID === 'none' ? 
                                                    currentUser.displayName 
                                                    :
                                                    myClubs.find(club=>club._id===session.associatedClubID).name
                                                }
                                            </h4>
                                        </td>
                                        <td>
                                            {session.title}
                                        </td>
                                        <td>
                                            {moment(session.startAt).format('LT')}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}
                    </div>

                    <br /><br /><br />

                    <h2 >Training Calendar</h2>
                    <br />
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
*/