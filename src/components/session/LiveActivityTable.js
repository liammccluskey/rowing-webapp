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

    const [activities, setActivities] = useState(props.activities)
    const [ergConnected, setErgConnected] = useState(props.ergConnected)
    const [activityInProgress, setActivityInProgress] = useState(props.activityInProgress)

    const [selectedActivityIDs, setSelectedActivityIDs] = useState(new Set())
    const [showErgConnectionError, setShowErgConnectionError] = useState(false)
    const [didCompleteActivity, setDidCompleteActivity] = useState(false)
    

    useEffect(() => {
        setActivities(props.activities)
        if (!didCompleteActivity) {
            setDidCompleteActivity(
                props.activities.filter(ac => ac.uid === currentUser.uid && ac.isCompleted).length > 0
            )
        }
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
            console.log('error finishing: no activity in progress')
            return
        }
        try {
            await api.patch(`/activities/${activityInProgress._id}/complete`)
            props.setActivityInProgress(null)

        } catch (error) {
            console.log(error)
        }
        setDidCompleteActivity(true)
    }

    async function handleClickStartWorkout() {
        if (activityInProgress) {return}
        if (! ergConnected) {
            setShowErgConnectionError(true)
            
            setTimeout(() => {
                setShowErgConnectionError(curr => !curr)
            }, 0.5*1000);
            return
        }
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

    function handleClickActivity(activityID) {
        if ( ! selectedActivityIDs.has(activityID) ) {
            setSelectedActivityIDs(new Set([...selectedActivityIDs, activityID ]))
        }
    }

    function handleClickCloseC2Screen(activityID) {
        selectedActivityIDs.delete(activityID)
        setSelectedActivityIDs( new Set(selectedActivityIDs) )
    }

    return (
        <div style={{border: '1px solid var(--bc)', borderRadius: '5px', marginBottom: hideSelf ? '10px': '50px'}}>
            <div className='d-flex jc-space-between ai-center' style={{
                padding: '2px 20px', backgroundColor: 'transparent'
            }}>
                <div className='d-flex jc-flex-start ai-center' style={{gap: '20px', minHeight: '50px'}}>
                    <button className='arrow-btn' onClick={() => setHideSelf(curr => !curr)}>
                        <Arrow direction={hideSelf ? 'right' : 'down'} color='var(--color-tertiary)' />
                    </button>
                    <p>{props.activityTitle}</p>
                </div>
                {didCompleteActivity && 
                    <img 
                        src='/images/checkmark.png' className='icon-checkmark'
                        style={{ marginRight: '35px' }}
                    />
                }
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
                
                
            </div>
            <div style={{padding: '20px 50px', display: hideInstructions ? 'none' : 'block', color: 'var(--color-secondary)'}}>
                <Arrow direction='left' color={showErgConnectionError ? 'var(--color-error)' : 'var(--color-tertiary)'} />
                <p style={{
                    display: 'inline-block', 
                    width: showErgConnectionError ? '30px' : '15px',
                    color: showErgConnectionError ? 'var(--color-error)' : 'var(--color-tertiary)',
                    fontWeight: '900', fontSize: '17px',
                    transition: 'width 0.2s',
                    textAlign: 'center'
                }}>
                    1
                </p>
                <Arrow 
                    direction='right' 
                    color={showErgConnectionError ? 'var(--color-error)' : 'var(--color-tertiary)'} 
                    style={{marginRight: '15px'}} 
                />
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
                        style={{marginLeft: '48px', marginTop: '15px'}} className='clear-btn-secondary'
                    >
                        Connect to New Erg
                    </button> 
                    :
                    <button 
                        onClick={props.handleClickConnect} 
                        style={{marginLeft: '48px', marginTop: '15px'}} className='clear-btn-secondary'
                    >
                        Connect to Erg
                    </button>
                }
                <br /><br />
                <Arrow direction='left' color='var(--color-tertiary)' style={{marginTop: '10px'}} />
                <p style={{
                    display: 'inline-block', width: '15px',
                    color: 'var(--color-tertiary)',
                    fontWeight: '900', fontSize: '17px', textAlign: 'center'
                }}>
                    2
                </p>
                
                <Arrow direction='right' color='var(--color-tertiary)' style={{marginRight: '15px'}}/>
                Configure workout: 
                <p style={{display: 'inline', fontSize: '16px', fontWeight: 'bold', marginLeft: '20px', color: 'var(--color)'}}>
                    {props.activityTitle}
                </p>
                <br />
                <button 
                    style={{margin: '10px auto', display: 'block'}}
                    className='solid-btn-secondary'
                    onClick={handleClickStartWorkout}
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
                        handleClickClose={() => handleClickCloseC2Screen(ac._id)}
                    />
                ))} 
            </div>

            <div style={{ display: hideSelf ? 'none': 'block'}}>
                <table style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Pace</th>
                            <th>Ave Pace</th>
                            <th>Distance</th>
                            <th>Stroke Rate</th>
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
                                <td>{ac.currentPace}</td>
                                <td>{ac.averagePace}</td>
                                <td>{ac.totalDistance}</td>
                                <td>{ac.currentStrokeRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}