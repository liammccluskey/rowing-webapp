import React, {useState, useEffect} from 'react'
import {useAuth} from '../../contexts/AuthContext'


export default function MembersInfoCard(props) {
    const {currentUser} = useAuth()
    const [activities, setActivities] = useState(props.activities)

    useEffect(() => {
        setActivities(props.activities)
    }, [props.activities])

    return (
        <div style={{...props.style, padding: '20px 25px'}} className='float-container'>
            <div className='d-flex jc-space-between ai-center'>
                <h3>Members <small>( {activities.length} )</small></h3>
                <button onClick={props.handleClickJoin} className='solid-btn-secondary'>Join</button>
            </div>
            <br />
            <table style={{width: '100%'}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ready to Row</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(ac => (
                        <tr>
                            <td>{ac.name}</td>
                            {ac.isReady ? 
                                <td style={{color: 'green'}}>Yes</td> :
                                <td style={{color: 'red'}}>No</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}