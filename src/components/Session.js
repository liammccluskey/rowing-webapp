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

    useEffect(() => {
        setTimeout(() => {
            updateMyActivity()
        }, 3000)
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
            console.log('my index')
            console.log(res.data.findIndex(ac => ac.uid === currentUser.uid))
            
            setMyActivity(res.data[res.data.findIndex(ac => ac.uid === currentUser.uid)])
            
        } catch (error) {
            console.log(error)
        }
    }

    async function updateMyActivity() {
        console.log('Trying to update your activity. Current status: \n')
        console.log(myActivity)
        if (!myActivity) { console.log('no activity'); return }
        console.log('did update activity')
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
        fetchActivities()

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
                        <button onClick={handleClickJoin} className='solid-btn'>Join</button>
                    </div>
                    <br />
                    <div className='float-container'>
                        {activities.map((ac, index) => (
                            <div key={index} className='main-subcontainer  d-flex jc-space-between'>
                                <h4>Name: {ac.name}</h4>
                                <p>Current Pace: {ac.currentPace}</p>
                                <p>Average Pace: {ac.averagePace}</p>
                                <p>Total Meters: {ac.totalDistance}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}
