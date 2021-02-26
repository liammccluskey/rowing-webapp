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
    const [myActivity, setMyActivity] = useState(null)
    const [loading, setLoading] = useState(true)

    const [hideActivities, setHideActivities] = useState(false)
    const [hideResults, setHideResults] = useState(true)

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
        }, 20*1000)
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
            return Math.floor(Math.random()*50) % 100 + 25
        }
        const temp = myActivity
        temp.currentPace = random()
        temp.averagePace = random()
        temp.totalDistance += 5
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
        <div style={{height: '100vh'}}>
            <MainHeader />
            {loading ? <Loading /> :
            <div>
                <div className='main-container d-flex jc-flex-start ai-flex-start' style={{padding: '0px 25px', gap:'25px', margin: '0px'}}>
                    <div>
                        <br />
                        <SessionInfoCard session={session} style={{width: '275px', height: 'auto'}} />
                        <br />
                        <MembersInfoCard handleClickJoin={handleClickJoin} activities={activities} style={{width:'275px', height: 'auto'}}/>
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
                                {['2k Warmup', '10k SS @ 22', '2k Cooldown'].map((item, i) => (
                                    <div>
                                        <LiveActivityTable activities={activities} activityTitle={item} />
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
                                {['2k Warmup', '10k SS @ 22', '2k Cooldown'].map((item, i) => (
                                    <div>
                                        <LiveActivityTable activities={activities} activityTitle={item} />
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
