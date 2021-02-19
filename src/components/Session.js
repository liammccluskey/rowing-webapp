import React, {useEffect, useState} from "react"
import MainHeader from "./headers/MainHeader"
import SubHeader from './headers/SubHeader'
import {useAuth} from '../contexts/AuthContext'
import Loading from './misc/Loading'
import axios from "axios"
import {useParams} from 'react-router-dom'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Session(props) {
    const {sessionID} = useParams()
    const {currentUser} = useAuth()
    const [session, setSession] = useState(null)
    const [activities, setActivities] = useState([])
    const [myActivity, setMyActivity] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await fetchSession()
            await fetchActivities()
            setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(async () => {
        await updateMyActivity()
        setTimeout(async () => {
            await fetchActivities()
        }, 5000)
    }, [myActivity])

    async function fetchSession() {
        try {
            const res = await api.get(`/sessions/${sessionID}`)
            setSession(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchActivities() {
        try {
            const res = await api.get(`/sessions/${sessionID}/activities`)
            setActivities(res.data)
            setMyActivity(res.data[res.data.findIndex(ac => ac.uid === currentUser.uid)])
        } catch (error) {
            console.log(error)
        }
    }

    async function updateMyActivity() {
        if (!myActivity) { return }
        const random = () => {
            return Math.floor(Math.random()*100) % 100 + 50
        }
        const temp = myActivity
        temp.currentPace = random()
        temp.averagePace = random()
        temp.totalDistance = random()
        try {
            await api.patch(`/activities/${myActivity._id}`, temp)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleClickJoin() {
        const activityData = {
            name: currentUser.displayName,
            uid: currentUser.uid
        }
        try {
            const res = await api.post('/activities', activityData)
            const sessionData = {
                uid: currentUser.uid,
                activityID: res.data._id
            }
            await api.patch(`/sessions/${sessionID}/join`, sessionData)
            fetchActivities()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> :
            <div>
                <SubHeader title={session.title} />
                <div className='main-container'>
                        <div className='d-flex jc-space-between ai-center'>
                            <h3>Workout: 4 x 2k</h3>
                            {myActivity ? <button className='clear-btn-cancel'>Leave</button>:
                                <button onClick={handleClickJoin} className='solid-btn'>Join</button>
                            }
                            
                        </div>
                        <br />
                        <div className='float-container'>
                            <table style={{width: '100%'}} >
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Current Pace</th>
                                        <th>Average Pace</th>
                                        <th>Total Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((ac, index) => (
                                        <tr 
                                            key={index} 
                                            style={{borderLeft: ac.uid == currentUser.uid ? '5px solid var(--tint-color)' : 'none'}}
                                        >
                                            <td>{ac.name}</td>
                                            <td>{ac.currentPace}</td>
                                            <td>{ac.averagePace}</td>
                                            <td>{ac.totalDistance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
            </div>
            }
            
        </div>
    )
}
