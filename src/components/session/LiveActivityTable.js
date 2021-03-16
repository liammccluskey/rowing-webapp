import React, {useEffect, useState} from 'react'
import Arrow from '../misc/Arrow'
import C2Screen from '../misc/C2Screen'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'
import 'moment-duration-format'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function LiveActivityTable(props) {
    const {currentUser} = useAuth()

    const [hideSelf, setHideSelf] = useState(true)
    const [hideInstructions, setHideInstructions] = useState(true)

    const [activities, setActivities] = useState(
        props.activities.filter(ac => !ac.isCompleted)
    )
    const [ergConnected, setErgConnected] = useState(props.ergConnected)
    const [activityInProgress, setActivityInProgress] = useState(props.activityInProgress)
    const [startDisabled, setStartDisabled] = useState(false)

    const [selectedActivityIDs, setSelectedActivityIDs] = useState(new Set())
    const [showErgConnectionError, setShowErgConnectionError] = useState(false)
    const [didCompleteActivity, setDidCompleteActivity] = useState(false)

    const [usersCompletedCount, setUsersCompletedCount] = useState(0)
    const [usersActiveCount, setUsersActiveCount] = useState(0)
    

    useEffect(() => {
        setActivities(props.activities.filter(ac => !ac.isCompleted))
        /*
        if (!didCompleteActivity) {
            setDidCompleteActivity(
                props.activities.filter(ac => ac.uid === currentUser.uid && ac.isCompleted).length > 0
            )
        }
        */
        const completedUIDs = new Set()
        const activeUIDs = new Set()
        props.activities.forEach(ac => {
            if ( ac.uid === currentUser.uid && ac.isCompleted ) {
                setDidCompleteActivity(true)
            }
            if ( ac.isCompleted ) {
                completedUIDs.add( ac.uid )
            } else {
                activeUIDs.add( ac.uid )
            }
        })
        setUsersCompletedCount(completedUIDs.size)
        setUsersActiveCount(activeUIDs.size)
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
            setShowErgConnectionError(true)
            
            setTimeout(() => {
                setShowErgConnectionError(false)
            }, 1*1000);
        } else {
            const activity = {
                uid: currentUser.uid,
                name: currentUser.displayName,
                workoutItemIndex: props.workoutItemIndex,
                sessionID: props.session._id
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

    return (
        <div style={{borderTop: '1px solid var(--bc)'}}>
            <div className='d-flex jc-space-between ai-center'>
                <div 
                    className='d-flex jc-flex-start ai-center' 
                    style={{gap: '20px', minHeight: '55px', marginLeft: '20px'}}
                >
                    <button className='arrow-btn' onClick={() => setHideSelf(curr => !curr)}>
                        <Arrow direction={hideSelf ? 'right' : 'down'} color='var(--color-tertiary)' />
                    </button>
                    <h4 onClick={() => setHideSelf(curr => !curr)}>{props.activityTitle}</h4>
                </div>
                <div className='d-flex jc-flex-end ai-center'>
                    {activityInProgress ?
                        activityInProgress.workoutItemIndex === props.workoutItemIndex &&
                            <button
                                className='clear-btn-cancel'
                                style={{margin: '0px 10px'}}
                                onClick={handleClickFinish}
                            >
                                Finish
                            </button>
                        :
                        !didCompleteActivity && (hideInstructions ? 
                            <button
                                className='clear-btn-cancel' 
                                style={{margin: '0px 10px'}}
                                onClick={() => setHideInstructions(false)}
                            >
                                Begin
                            </button> 
                            :
                            <button
                                className='clear-btn-cancel'
                                style={{margin: '0px 10px'}}
                                onClick={() => setHideInstructions(true)}
                            >
                                Cancel
                            </button>
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
                            <h5 style={{color: 'var(--color-secondary)', display: 'inline', textAlign: 'right'}} >
                                {usersActiveCount}
                            </h5>
                        </div>
                        <div className='d-flex ai-center jc-space-between' style={{width: '100%'}}>
                            <h5 style={{color: 'var(--color-secondary)', display: 'inline', textAlign: 'left'}}> 
                                Complete
                            </h5>
                            <h5 style={{color: 'var(--color-secondary)', display: 'inline', textAlign: 'right'}} >
                                {usersCompletedCount}
                            </h5>
                        </div>
                    </div>
                    
                    <div className='d-flex ai-center jc-center' style={{
                        height: '40px', width: '125px',
                        borderLeft: '1px solid var(--bc)',
                        textAlign: 'center',
                    }}>
                        <div className='icon-circle-clear' 
                            style={{opacity: !didCompleteActivity && '0%', borderColor: 'var(--color-success)'
                        }}>
                            <div className='checkmark' />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{padding: '20px 50px', display: hideInstructions ? 'none' : 'block', color: 'var(--color-secondary)'}}>
                
                <h3 style={{ 
                        marginRight: '30px',
                        backgroundColor: showErgConnectionError && 'var(--color-error)',
                        color: showErgConnectionError && 'var(--bgc-light)',
                        borderColor: showErgConnectionError && 'transparent',
                        transition: 'background-color 0.2s' 
                    }} 
                    className='number-item'
                >
                    1
                </h3>
                Connect ergometer: 
                <p style={{
                    color: ergConnected ? 'var(--color-success)' : 'var(--color-error)',
                    display: 'inline', fontSize: '16px',
                    marginLeft: '10px'
                }}>
                    {ergConnected ? ' Connected' : ' Not Connected'}
                </p><br />
                {ergConnected ? 
                    <button 
                        onClick={props.handleClickConnect}
                        style={{marginLeft: '65px', marginTop: '15px'}} className='clear-btn-secondary'
                    >
                        Reconnect
                    </button> 
                    :
                    <button 
                        onClick={props.handleClickConnect} 
                        style={{marginLeft: '65px', marginTop: '15px'}} className='clear-btn-secondary'
                    >
                        Connect
                    </button>
                }
                <br /><br />
                <h3 style={{ marginRight: '30px' }} className='number-item'>2</h3>
                
                Configure workout: 
                <p style={{display: 'inline', fontSize: '16px', marginLeft: '20px', color: 'var(--color)'}}>
                    {props.activityTitle}
                </p>
                <br /><br />
                <button 
                    style={{margin: '10px auto', display: 'block'}}
                    className='clear-btn-secondary'
                    onClick={handleClickStartWorkout}
                    disabled={startDisabled}
                >
                    Start Workout
                </button>
            </div >
                
            <div 
                className='d-flex jc-space-around ai-flex-start' 
                style={{display: hideSelf ? 'none' : 'flex', padding: '0px 20px', flexWrap: 'wrap'}}
            >
                
                {activities.filter(ac => selectedActivityIDs.has(ac._id)).map(ac =>(
                    <C2Screen 
                        activity={ac} 
                        style={{height: 'auto', width: '275px', margin: '15px 10px'}} 
                        handleClickClose={() => removeSelectedActivity(ac._id)}
                    />
                ))} 
            </div>

            <div style={{
                display: hideSelf ? 'none': 'block',
                border: '1px solid var(--bc)', borderRadius: '5px',
                margin: '20px 40px 40px 40px'
            }}>
                <table className='data-table' style={{width: '100%'}}>
                    <thead>
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
                            <tr 
                                key={index} 
                                style={{
                                    borderLeft: ac.uid == currentUser.uid ? '3px solid var(--tint-color)' : 'none'
                                }}
                                onClick={() => handleClickActivity(ac._id)}
                            >
                                <td>{ac.name}</td>
                                <td>{moment.duration(ac.currentPace, 'seconds').format('hh:mm:ss')}</td>
                                <td>{moment.duration(ac.averagePace, 'seconds').format('hh:mm:ss')}</td>
                                <td>{ac.distance.toFixed()}</td>
                                <td>{ac.strokeRate}</td>
                                <td>{moment.duration(ac.elapsedTime, 'seconds').format('hh:mm:ss')}</td>
                            </tr>
                        ))}
                        {!activities.length &&
                            <tr>
                                <td>No activities in progress</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}
