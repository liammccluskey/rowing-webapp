import React, { useEffect, useState} from "react"
import MainHeader from "../headers/MainHeader"
import Calendar from './Calendar'
import UserInfoCard from './UserInfoCard'
import ClubsInfoCard from './ClubsInfoCard'
import NewSessionForm from './NewSessionForm'
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import Loading from '../misc/Loading'
import ActivityCard from '../feed/ActivityCard'
import axios from "axios"
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Dashboard() {
    const { currentUser, thisUser } = useAuth()
    const history = useHistory()

    const [myClubs, setMyClubs] = useState([])
    const [todaySessions, setTodaySessions] = useState([])
    const [loading, setLoading] = useState(true)

    const [showSessionForm, setShowSessionForm] = useState(false)

    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await fetchClubs()
            await fetchSessions()
            setLoading(false)
        }
        fetchData()

        fetchFeed()
    }, [])

    async function fetchClubs() {
        const url = `/clubmemberships/user/${thisUser._id}`
        const res = await api.get(url)
        setMyClubs(res.data)
    }

    async function fetchSessions() {
        const query = {
            year: moment().year(),
            month: moment().month(),
            day: moment().date(),
            sparse: 0
        }
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&')
        try {
            const res = await api.get(`/sessions/user/${thisUser._id}?${queryString}`)
            setTodaySessions(res.data)
        } catch (error) { console.log(error) }
    }

    function routeToSession(session) {
        history.push(`/sessions/${session._id}`)
    }

    function handleClickCalendar() {
        history.push(`/training/calendar`)
    }

    async function fetchFeed() {
        try {
            const res = await api.get(`/activities/search?user=${thisUser._id}&page=1&sortby=-createdAt&pagesize=15`)
            setActivities(res.data.activities)
        } catch (error) {
            console.log(error.response.data.message)
        }
        setLoadingActivities(false)
    }

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0}} />
            <br /><br />
            <div className='main-container'
                style={{  display: 'grid', gridTemplateColumns: '1fr 4fr', gap: 75, padding: '0px 75px',
            }}
            >
                <div>
                    <UserInfoCard style={{width: 300}} />
                    <br /><br />
                    <ClubsInfoCard clubs={myClubs} style={{width: 300}} />
                </div>
                
                <div>
                    <div>
                        <div className='d-flex jc-space-between ai-center'>
                            <h3>Today's Workouts</h3>
                            <div>
                                <button className='clear-btn-secondary mr-20' onClick={handleClickCalendar}>
                                    View Calendar
                                </button>
                                <button className='solid-btn-secondary' onClick={() => setShowSessionForm(true)}>
                                    New Workout
                                </button>
                            </div>
                            
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
                                        <th >Start Time</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {todaySessions.map( (session, i) => (
                                    <tr key={i} onClick={() => routeToSession(session)} >
                                        <td className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                            {session.club && <img src={session.club.iconURL} className='club-icon' />}
                                            {!session.club && (
                                                session.hostUser.iconURL ? 
                                                    <img src={session.hostUser.iconURL} className='user-icon' />
                                                    :
                                                    <div className='user-icon-default'>
                                                        <i className='bi bi-person' />
                                                    </div>
                                            )}
                                            <p> {session.club ? session.club.name : currentUser.displayName} </p>
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
                                <p className='c-cs fw-xs' style={{textAlign: 'center', padding: 15}}>
                                    You have no workouts scheduled for today
                                </p>
                            }
                        </div>}
                    </div>

                    <br /><br /><br />
                    <h3>Activity Feed</h3>
                    <br />
                    {(!loadingActivities && activities.length > 0) && activities.map(ac => 
                        <ActivityCard activity={ac} />
                    )}
                </div>
            </div>
        </div>
        
    )   

}
