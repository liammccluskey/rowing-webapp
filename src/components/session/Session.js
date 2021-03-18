import React, {useEffect, useState} from "react"
import MainHeader from "../headers/MainHeader"
import SubHeader from '../headers/SubHeader'
import MembersInfoCard from './MembersInfoCard'
import SessionInfoCard from './SessionInfoCard'
import LiveActivityTable from './LiveActivityTable'
import ResultsTable from './ResultsTable'
import Arrow from '../misc/Arrow'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from "axios"
import moment from 'moment'
import {useParams} from 'react-router-dom'

import {PM5} from './connect_pm5/pm5'

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

    const [ergConnected, setErgConnected] = useState(false)
    const [activityInProgress, setActivityInProgress] = useState(null)

    const [C2Data, setC2Data] = useState(null)

    const pm5 = new PM5(
        () => { console.log('connecting')}, // cbConnecting
        () => { setErgConnected(true) },    // cbConnected
        () => { setErgConnected(false) },   // cbDisconnected
        (m) => {                             // cbMessage
            setC2Data(curr => ({...curr, ...m.data}))       
        }
    )

    useEffect(() => {
        // confirm page refresh
        window.onbeforeunload = (event) => {
            const e = event || window.event;
            // Cancel the event
            e.preventDefault();
            if (e) {
              e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
          };

        // disonnect on component dismount
        const disconnect = () => {
            if ( pm5.connected() ) { pm5.doDisconnect() } 
            window.onbeforeunload = () => {}
        }
        return disconnect
    }, [])

    useEffect(() => {
        const refreshRate = 10 // seconds
        async function fetchData() {
            console.log('\n fetching data \n')
            await fetchSession()
            await fetchActivities()
            setLoading(false)
        }
        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, refreshRate*1000);

        return () => clearInterval(interval)
    }, [])

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
            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < res.data[i].length; j++) {
                    if (res.data[i][j].uid === currentUser.uid && !res.data[i][j].isCompleted) {
                        setActivityInProgress(res.data[i][j])
                        return
                        // Assume there is only one? -> potential bug
                        // Should be the case, but this state is possible (almost impossible)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [lastPatchTime, setLastPatchTime] = useState(moment())
    useEffect(() => {
        if (moment().diff(lastPatchTime, 'seconds') < 10) {return}
        else if (! activityInProgress) { return }

        const updatedActivity = {
            ...activityInProgress,
            ...C2Data
        }
        
        async function patchActivity() {
            try {
                await api.patch(`/activities/${activityInProgress._id}`, updatedActivity)
                console.log('did update activity in progress')
            } catch (error) {
                console.log(error)
            }
        }
        patchActivity()
            .then( setLastPatchTime(moment()) )
    }, [C2Data])

    async function handleClickJoin() {
        try {
            await api.patch(`/sessions/${sessionID}/join`, {uid: currentUser.uid})
            fetchSession()
        } catch (error) {
            console.log(error)
        }
    }

    function handleClickConnect() {
        if (!navigator.bluetooth) {
            alert('This browser does not support bluetooth.');
        } else if (pm5.connected()) {
            return
        } else {
            pm5.doConnect()
        }
    }

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> :
            <div 
                className='main-container' 
                style={{ padding: '0px 25px', marginBottom: '100px'
                }} 
            >
                <br /><br/>
                <div 
                    className='d-flex jc-flex-start ai-flex-start' 
                    style={{ gap:'50px' }}
                >
                    <div 
                        className='float-container'
                        style={{ width: '250px', padding: '20px 0px' }}
                    >
                        <SessionInfoCard 
                            session={session} 
                            style={{ padding: '0px 20px' }}
                        />
                        <br /><br />
                        <MembersInfoCard 
                            handleClickJoin={handleClickJoin} 
                            session={session}
                            style={{
                                height: '400px',
                                overflow: 'scroll'
                            }}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <div >
                            <h2>{session.title}</h2>
                            <br />
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                <button className='arrow-btn' onClick={() => setHideActivities(curr => !curr)}>
                                    <Arrow direction={hideActivities ? 'right' : 'down'} color='var(--color-tertiary)' />
                                </button>
                                <h3 onClick={() => setHideActivities(curr => !curr)}>Workout Activities</h3>
                            </div>
                            <div style={{display: hideActivities ? 'none' : 'block',padding: '30px 20px 0px 20px'}}>

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
                        <div>
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                <button className='arrow-btn' onClick={() => setHideResults(curr => !curr)}>
                                    <Arrow direction={hideResults ? 'right' : 'down'} color='var(--color-tertiary)' />
                                </button>
                                <h3 onClick={() => setHideResults(curr => !curr)}>Workout Results</h3>
                            </div>
                            <div style={{display: hideResults ? 'none' : 'block',padding: '30px 20px'}}>
                                {session.workoutItems.map((item, i) => (
                                    <div>
                                        <ResultsTable 
                                            activities={activities[i]} 
                                            activityTitle={item} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}
