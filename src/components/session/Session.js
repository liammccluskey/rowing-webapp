import React, {useEffect, useState} from "react"
import MainHeader from "../headers/MainHeader"
import SubHeader from '../headers/SubHeader'
import MembersInfoCard from './MembersInfoCard'
import SessionInfoCard from './SessionInfoCard'
import LiveActivityTable from './LiveActivityTable'
import Arrow from '../misc/Arrow'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
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
    const [loading, setLoading] = useState(true)

    const [hideActivities, setHideActivities] = useState(false)
    const [hideResults, setHideResults] = useState(true)

    const [currentWorkoutItemIndex, setCurrentWorkoutItemIndex] = useState(-1)
    const [ergConnected, setErgConnected] = useState(false)
    const [activityInProgress, setActivityInProgress] = useState(null)

    useEffect(() => {
        async function fetchData() {
            await fetchSession()
            await fetchActivities()
            setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(async () => {
        await updateActivityInProgress()
        setTimeout(async () => {
            await fetchActivities()
        }, 5*1000)
    }, [activityInProgress])

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

            //if (activityInProgress) {return}

            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < res.data[i].length; j++) {
                    if (res.data[i][j].uid === currentUser.uid && !res.data[i][j].isCompleted) {
                        setActivityInProgress(res.data[i][j])
                        return
                        // Assume there is only one? -> potential bug
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function updateActivityInProgress() {
        if (! activityInProgress) {
            console.log('Error: no activity in progress')
            return
        }
        const random = () => {
            return Math.floor(Math.random()*70) % 70 + 60
        }
        const temp = activityInProgress
        temp.currentPace = random()
        temp.averagePace = random()
        temp.totalDistance += 5
        temp.currentStrokeRate = 22
        temp.totalTime += 15
        try {
            await api.patch(`/activities/${activityInProgress._id}`, temp)
            console.log('did update activity in progress')
        } catch (error) {
            console.log(error)
        }
    }

    async function handleClickJoin() {
        try {
            await api.patch(`/sessions/${sessionID}/join`, {uid: currentUser.uid})
            fetchSession()
        } catch (error) {
            console.log(error)
        }
    }

    function handleClickConnect() {
        setErgConnected(true)
    }

    return (
        <div style={{height: '100vh'}}>
            <MainHeader />
            {loading ? <Loading /> :
            <div>
                <div className='main-container d-flex jc-flex-start ai-flex-start' style={{padding: '0px 25px', gap:'25px', margin: '0px'}}>
                    <div>
                        <br />
                        <SessionInfoCard session={session} style={{width: '250px', height: 'auto'}} />
                        <br />
                        <MembersInfoCard 
                            handleClickJoin={handleClickJoin} 
                            session={session} 
                            style={{width:'250px', height: 'auto'}}/>
                    </div>
                    <div style={{flex: 1, height:'100vh', overflow: 'scroll'}}>
                        <br />
                        <div className='float-container' style={{padding: '20px 25px'}}>
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                <button className='arrow-btn' onClick={() => setHideActivities(curr => !curr)}>
                                    <Arrow direction={hideActivities ? 'right' : 'down'} color='var(--color-tertiary)' />
                                </button>
                                <h3>Workout Activities</h3>
                            </div>
                            <div style={{display: hideActivities ? 'none' : 'block'}}>
                                <br /><br />
                                {session.workoutItems.map((item, i) => (
                                    <div>
                                         <LiveActivityTable 
                                            activities={activities[i]}
                                            activityInProgress={activityInProgress}
                                            setActivityInProgress={setActivityInProgress}
                                            activityTitle={item} 
                                            session={session}
                                            workoutItemIndex={i}
                                            fetchActivities={fetchActivities}
                                            ergConnected={ergConnected}
                                            handleClickConnect={handleClickConnect}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div className='float-container' style={{padding: '20px 25px'}}>
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                <button className='arrow-btn' onClick={() => setHideResults(curr => !curr)}>
                                    <Arrow direction={hideResults ? 'right' : 'down'} color='var(--color-tertiary)' />
                                </button>
                                <h3>Workout Results</h3>
                            </div>
                            <div style={{display: hideResults ? 'none' : 'block'}}>
                                <br /><br />
                                {session.workoutItems.map((item, i) => (
                                    <div>
                                        <LiveActivityTable 
                                            activities={activities[i]} 
                                            activityTitle={item} 
                                            session={session}
                                            workoutItemIndex={i}
                                            fetchActivities={fetchActivities}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                       <p style={{marginTop: '200px'}}></p>
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}
