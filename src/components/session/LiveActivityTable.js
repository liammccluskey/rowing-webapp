import React, {useEffect, useState} from 'react'
import Arrow from '../misc/Arrow'
import {useAuth} from '../../contexts/AuthContext'

export default function LiveActivityTable(props) {
    const [activities, setActivities] = useState(props.activities)
    const [hideSelf, setHideSelf] = useState(true)
    const {currentUser} = useAuth()

    useEffect(() => {
        setActivities(props.activities)
    }, [props.activities])

    return (
        <div style={{border: '1px solid var(--bc)', borderRadius: '5px', marginBottom: hideSelf ? '10px': '50px'}}>
            <div className='d-flex jc-space-between ai-center' style={{padding: '2px 20px', backgroundColor: 'var(--bgc-hover)'}}>
                <div>
                    <button className='arrow-btn' onClick={() => setHideSelf(curr => !curr)}>
                        <Arrow direction={hideSelf ? 'right' : 'down'} color='var(--color-tertiary)' />
                    </button>
                    
                    <p style={{display: 'inline', marginLeft: '15px'}}>{props.activityTitle}</p>
                </div>
                
                <button className='clear-btn-cancel' style={{margin: '0px 10px'}}>Begin</button>
            </div>
            <div style={{ display: hideSelf ? 'none': 'block'}}>
                <table style={{width: '100%'}}>
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
                                style={{borderLeft: ac.uid == currentUser.uid ? '3px solid var(--tint-color)' : 'none'}}
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
        
    )
}