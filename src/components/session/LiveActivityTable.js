import React, {useEffect, useState} from 'react'
import C2Screen from '../misc/C2Screen'
import C2Results from '../misc/C2Results'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import axios from 'axios'
import moment from 'moment'
import 'moment-duration-format'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function LiveActivityTable(props) {
    const {currentUser, thisUser} = useAuth()
    const {setMessage} = useMessage()

    const [hideSelf, setHideSelf] = useState(true)
    const [hideInstructions, setHideInstructions] = useState(true)

    const [activities, setActivities] = useState(
        props.activities.filter(ac => !ac.isCompleted)
    )
    const [ergConnected, setErgConnected] = useState(props.ergConnected)
    const [activityInProgress, setActivityInProgress] = useState(props.activityInProgress)
    const [startDisabled, setStartDisabled] = useState(false)

    const [selectedActivityIDs, setSelectedActivityIDs] = useState(new Set())
    const [didCompleteActivity, setDidCompleteActivity] = useState(false)

    const [usersCompletedCount, setUsersCompletedCount] = useState(0)
    const [usersActiveCount, setUsersActiveCount] = useState(0)
    

    useEffect(() => {
        setActivities(props.activities.filter(ac => !ac.isCompleted))
        
        const completedIDs = new Set()
        const activeIDs = new Set()

        props.activities.forEach(ac => {
            if (ac.user._id === thisUser._id && ac.isCompleted) {
                setDidCompleteActivity(true)
            }
            if (ac.isCompleted) {completedIDs.add(ac.user._id)}
            else {activeIDs.add(ac.user._id)}
        })

        setUsersActiveCount(activeIDs.size)
        setUsersCompletedCount(completedIDs.size)

    }, [props.activities])

    useEffect(() => {
        setErgConnected(props.ergConnected)
    }, [props.ergConnected])

    useEffect(() => {
        setActivityInProgress(props.activityInProgress)
        if (activityInProgress) {setHideInstructions(true)}
    }, [props.activityInProgress])

    async function handleClickFinish() {
        if (! activityInProgress) {
            // extra check: this should not be possible
            console.log('error finishing: no activity in progress')
            return
        } else if (activityInProgress.workoutItemIndex !== props.workoutItemIndex) {
            // extra check: this should not be possible
            console.log('error finishing activity: incorrect WorkoutItemIndex')
        }
        removeSelectedActivity(activityInProgress._id)
        try {
            await api.patch(`/activities/${activityInProgress._id}/complete`)
            props.setActivityInProgress(null)

        } catch (error) {
            console.log(error)
        }
        setDidCompleteActivity(true)
    }

    async function handleClickStartWorkout() {
        setStartDisabled(true)

        if (activityInProgress) {
            // extra check: cannot start while activity in progress
            // present error message to user ?
        }
        else if (! ergConnected) {
            setMessage({title: 'Connect your ergometer before starting a workout.', isError: true, timestamp: moment()})
        } else {
            const activity = {
                user: thisUser._id,
                workoutItemIndex: props.workoutItemIndex,
                session: props.session._id
            }
            try {
                const res = await api.post('/activities', activity)
                handleClickActivity(res.data._id)
                props.setActivityInProgress(res.data)
                props.fetchActivities()
            } catch (error) {
                console.log(error)
            }
    
            setHideSelf(false)
            setHideInstructions(true)
        }
        setStartDisabled(false)
    }

    function handleClickActivity(activityID) {
        if ( ! selectedActivityIDs.has(activityID) ) {
            setSelectedActivityIDs(new Set([...selectedActivityIDs, activityID ]))
        }
    }

    function removeSelectedActivity(activityID) {
        selectedActivityIDs.delete(activityID)
        setSelectedActivityIDs( new Set(selectedActivityIDs) )
    }

    function handleClickConfigureWorkout() {
        setMessage({title: "We're working on this. Please set up this workout on your machine manually.", isError: false, timestamp: moment()})
    }

    return (
        <div style={{marginBottom: hideSelf ? 0 : 30}} className='live-activity-table'>
            <div className='d-flex jc-space-between ai-center'>
                <div className='d-flex jc-flex-start ai-center clickable-container-np' 
                    style={{ minHeight: '55px', padding: '0px 5px', cursor: 'pointer'}} 
                    onClick={() => setHideSelf(curr => !curr)}
                >
                    <i className={`bi bi-chevron-${hideSelf ? 'right' : 'down'} icon-btn-circle c-cs mr-10`}/>
                    <h4>{props.activityTitle}</h4>
                </div>
                <div className='d-flex jc-flex-end ai-center'>
                    {activityInProgress ?
                        activityInProgress.workoutItemIndex === props.workoutItemIndex &&
                            <button className='clear-btn-cancel mr-10' onClick={handleClickFinish}> Finish </button>
                        :
                        !didCompleteActivity && (hideInstructions ? 
                            <button className='clear-btn-cancel mr-10' onClick={() => setHideInstructions(false)} > Begin </button> 
                            :
                            <button className='clear-btn-cancel mr-10' onClick={() => setHideInstructions(true)} > Cancel </button>
                        )
                    }
                    <div 
                        style={{
                            height: '40px', width: '95px',
                            borderLeft: '1px solid var(--bc)',
                            padding: '0px 15px'
                        }}
                    >
                        <div className='d-flex ai-center jc-space-between' style={{width: '100%'}}>
                            <h5 style={{color: 'var(--color-secondary)', display: 'inline', textAlign: 'left'}}> 
                                Active
                            </h5>
                            <h5 style={{color: 'var(--tint-color)', display: 'inline', textAlign: 'right'}} >
                                {usersActiveCount}
                            </h5>
                        </div>
                        <div className='d-flex ai-center jc-space-between' style={{width: '100%'}}>
                            <h5 style={{color: 'var(--color-secondary)', display: 'inline', textAlign: 'left'}}> 
                                Complete
                            </h5>
                            <h5 style={{color: 'var(--tint-color)', display: 'inline', textAlign: 'right'}} >
                                {usersCompletedCount}
                            </h5>
                        </div>
                    </div>
                    
                    <div className='d-flex ai-center jc-center tooltip' style={{ height: 40, width: 125, borderLeft: '1px solid var(--bc)'}}>

                        <div className='tooltip-text'><h6>
                            {didCompleteActivity ? 'Activity complete' : 'Activity incomplete'}
                        </h6></div>
                        <i className={didCompleteActivity ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'}
                            style={{fontSize: 25, color: didCompleteActivity ? 'var(--color-success)':'var(--color-yellow-text'}} 
                        />
                    </div>
                </div>
            </div>
            <div style={{margin: '0px 20px', borderLeft: '2px solid var(--bc)'}}>
                <div style={{ display: hideInstructions && 'none', padding: '10px 25px', marginBottom: 20 }} className='c-cs'>
                    <h4 className='c-cs'>Activity Intsructions</h4>
                    <br />
                    <div style={{padding: '0px 20px'}}>
                        <div className='d-flex jc-flex-start ai-center'>
                            <h4 className='number-item mr-30'>1</h4>
                            <button onClick={props.handleClickConnect} className='clear-btn-secondary mr-10'>
                                {ergConnected ? 'Reconnect' : 'Connect Ergometer'}
                            </button> 
                            <p style={{ color: ergConnected ? 'var(--color-success)' : 'var(--color-error)'}}>
                                {ergConnected ? ' Connected' : ' Not Connected'}
                            </p>
                        </div>
                        
                        <br />
                        <div className='d-flex jc-flex-start ai-center'>
                            <h4 className='number-item mr-30'>2</h4>
                            <button onClick={handleClickConfigureWorkout} className='clear-btn-secondary mr-10'> 
                                Push workout to my erg
                            </button>
                        </div>
                        
                        <br />
                        <button onClick={handleClickStartWorkout} className='solid-btn-secondary'
                            style={{display: 'block'}}
                            disabled={startDisabled}
                        >
                            Start Workout
                        </button>
                    </div>
                </div >
                    
                <div className='d-flex jc-space-around ai-flex-start' 
                    style={{display: hideSelf ? 'none' : 'flex', flexWrap: 'wrap'}}
                >
                    {activities.filter(ac => selectedActivityIDs.has(ac._id)).map(ac =>(
                        <C2Screen 
                            activity={ac} 
                            style={{height: 'auto', width: '275px', margin: '15px 10px'}} 
                            handleClickClose={() => removeSelectedActivity(ac._id)}
                        />
                    ))} 
                </div>

                <div style={{display: hideSelf ? 'none': 'block'}}>
                    <table className='data-table workout-table' style={{width: '100%'}}>
                        <thead >
                            <tr>
                                <th>Name</th>
                                <th>Pace</th>
                                <th>Ave Pace</th>
                                <th>Distance</th>
                                <th>Stroke Rate</th>
                                <th>Elapsed Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((ac, index) => (
                                <tr key={index} onClick={() => handleClickActivity(ac._id)}
                                    style={{ borderLeft: ac.user._id == thisUser._id ? '3px solid var(--tint-color)' : 'none' }} 
                                >
                                    <td>{ac.user.displayName}</td>
                                    <td>{moment.duration(ac.currentPace, 'seconds').format('hh:mm:ss')}</td>
                                    <td>{moment.duration(ac.averagePace, 'seconds').format('hh:mm:ss')}</td>
                                    <td>{ac.distance.toFixed()}</td>
                                    <td>{ac.strokeRate}</td>
                                    <td>{moment.duration(ac.elapsedTime, 'seconds').format('hh:mm:ss')}</td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                    {!activities.length &&
                        <p className='empty-table-message'>No activities in progress</p>
                    }
                </div>
                
            </div>
        </div>
        
    )
}
