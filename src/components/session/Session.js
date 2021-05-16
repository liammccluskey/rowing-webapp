import React, {useEffect, useState, useCallback} from "react"
import MainHeader from "../headers/MainHeader"
import SubHeader from '../headers/SubHeader'
import MembersInfoCard from './MembersInfoCard'
import SessionInfoCard from './SessionInfoCard'
import LiveActivityTable from './LiveActivityTable'
import ResultsTable from './ResultsTable'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from "axios"
import moment from 'moment'
import {useParams} from 'react-router-dom'
import Chat from '../chat/Chat'

import {PM5} from './connect_pm5/pm5'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Session(props) {
    const {sessionID} = useParams()
    const {currentUser, thisUser} = useAuth()
    const [session, setSession] = useState(null)
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)

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
            e.preventDefault();
            if (e) {
              e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
          };

        const disconnect = () => {
            if ( pm5.connected() ) { pm5.doDisconnect() } 
            window.onbeforeunload = () => {}
        }
        return disconnect
    }, [])

    useEffect(() => {
        const refreshRate = 20 // seconds
        async function fetchData() {
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
                    if (res.data[i][j].user._id === thisUser._id && !res.data[i][j].isCompleted) {
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
            } catch (error) {
                console.log(error)
            }
        }
        patchActivity()
            .then( setLastPatchTime(moment()) )
    }, [C2Data])

    function handleClickConnect() {
        if (!navigator.bluetooth) {
            alert('This browser does not support bluetooth.');
        } else if (pm5.connected()) {
            return
        } else {
            pm5.doConnect()
        }
    }
/*

                        <div style={{display: 'none'}}>
                            <iframe src="https://discord.com/widget?id=841373626519257118&theme=dark" width="350" height='550' allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                        </div>
*/

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, borderBottom: '1px solid var(--bc)'}} />
            {loading ? <Loading /> :
            <div className='main-container session-page' style={{ padding: 0}} >
                <div className='d-flex jc-flex-start ai-flex-start' >
                    <div className='workout-menu' style={{
                        width: 350, minWidth: 300, height: 'calc(100vh - var(--main-nav-height) - 1px', position: 'sticky',
                        top: 'calc(var(--main-nav-height) + 1px)',
                        }}
                    >
                        <div style={{ height: 150, padding: '0px 20px'}}>
                            <br />
                            <SessionInfoCard session={session} />
                        </div>
                            
                        <Chat roomID={sessionID} height={'calc(100vh - 1px - var(--main-nav-height) - 150px)'}/>
                        
                    </div>
                    <div className='session-sections' style={{flex: 1, padding: '0px 0px'}}>
                        <br /><br />
                        <h3 className='fw-s session-section-title'>Activities</h3>
                        <div className='session-section-container float-container'>
                            {session.workoutItems.map((item, i) => (
                                <div key={i}>
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
                                        zIndexHeader={i}
                                    />
                                </div>
                            ))}
                        </div>

                        <br /><br />

                        <h3 className='fw-s session-section-title'>Results</h3>
                        <div className='session-section-container float-container'>
                            {session.workoutItems.map((item, i) => (
                                <div key={i}>
                                    <ResultsTable 
                                        activities={activities[i]} 
                                        activityTitle={item} 
                                        zIndexHeader={session.workoutItems.length + i}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{height: 200}} />
                    </div>
                </div>
            </div>
            }
            
        </div>
    )
}
