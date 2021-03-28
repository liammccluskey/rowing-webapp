import React, { useEffect, useState} from "react"
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
        const query = {
            year: moment().year(),
            month: moment().month(),
            day: moment().date()
        }
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&')
        try {
            const res = await api.get(`/sessions/uid/${currentUser.uid}?${queryString}`)
            setTodaySessions(res.data)
        } catch (error) {
            console.log(error)
        }
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

                            <h3 style={{fontWeight: '400'}}>Today's Workouts</h3>
                            <button className='clear-btn-secondary' onClick={() => setShowSessionForm(true)}>
                                <div>Add Workout</div>
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
                            <table style={{width: '100%'}} >
                                <thead>
                                    <tr >
                                        <th >Host</th>
                                        <th >Title</th>
                                        <th >Starts At</th>
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
                                            <p>
                                                {session.associatedClubID === 'none' ? 
                                                    currentUser.displayName 
                                                    :
                                                    myClubs.find(club=>club._id===session.associatedClubID).name
                                                }
                                            </p>
                                                
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
                                <p style={{textAlign: 'center', padding: '15px 0px', color: 'var(--color-secondary)' }}>
                                    You have no workouts scheduled for today
                                </p>
                            }
                        </div>}
                    </div>

                    <br /><br /><br />

                    <h3 >Training Calendar</h3>
                    <Calendar />
                </div>
                
                
            </div>
        </div>
        
    )   

}
