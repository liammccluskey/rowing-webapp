import React, {useEffect, useState} from 'react'
import C2Screen from '../misc/C2Screen'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'
import 'moment-duration-format'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function ResultsTable(props) {
    const {currentUser} = useAuth()

    const [hideSelf, setHideSelf] = useState(true)
    const [sortedKey, setSortedKey] = useState('name')
    const [sortAscending, setSortAscending] = useState(true)

    const tableColumns = [
        {title: 'Name', key: 'name'},
        {title: 'Ave Pace', key: 'averagePace'},
        {title: 'Distance', key: 'distance'},
        {title: 'Stroke Rate', key: 'strokeRate'},
        {title: 'Elapsed Time', key: 'elapsedTime'}
    ]

    const [activities, setActivities] = useState(props.activities.filter(ac => ac.isCompleted))

    useEffect(() => {
        const completedActivities = props.activities.filter(ac => ac.isCompleted)
        if (hideSelf) {
            setActivities(completedActivities)
        } else {
            setActivities( sortActivities([...completedActivities]) )
        }
    }, [props.activities])

    useEffect(() => {
        if (hideSelf) {return}
        setActivities([...sortActivities(activities)])
    }, [sortAscending, sortedKey])

    function sortActivities(inputActivities) {
        if (sortAscending) {
            return inputActivities.sort( (a, b) => a[sortedKey] < b[sortedKey] ? -1 : 1)
        } else {
            return inputActivities.sort( (a, b) => a[sortedKey] > b[sortedKey] ? -1 : 1)
        }
    }

    function handleClickActivity() {
        // what to do here ? 
        // send to new page with in depth stats on activity ?
    }

    return (
        <div style={{marginBottom: hideSelf ? 0 : 30}}>
            <div className='d-flex jc-space-between ai-center'>
                <div className='d-flex jc-flex-start ai-center clickable-container-np' 
                    style={{ minHeight: '55px', padding: '0px 5px', cursor: 'pointer'}} 
                    onClick={() => setHideSelf(curr => !curr)}
                >
                    <i className={`bi bi-chevron-${hideSelf ? 'right' : 'down'} icon-btn-circle c-cs mr-10`}/>
                    <h4>{props.activityTitle}</h4>
                </div>
            </div>

            <div style={{display: hideSelf && 'none', margin: '0px 20px', borderLeft: '2px solid var(--bc)'}}>
                <table className='data-table workout-table' style={{width: '100%'}}>
                    <thead>
                        <tr>
                            {tableColumns.map((col, idx) => (
                                <th key={idx} className={sortedKey === col.key ? 'th-sortable th-selected' : 'th-sortable'}
                                    onClick={() => {
                                        setSortedKey(col.key)
                                        setSortAscending(curr => !curr)
                                    }}
                                >
                                    {col.title}
                                    <div className={!sortAscending ? 'rotate-180':''} style={{display: 'inline-block', marginLeft: '8px'}}>
                                        <i className='bi bi-triangle-fill' 
                                            style={{
                                                fontSize: '10px', color: 'var(--tint-color)',
                                                opacity: sortedKey !== col.key && '0%'
                                            }} 
                                        />
                                    </div>
                                    
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((ac, index) => (
                            <tr key={index} onClick={() => handleClickActivity(ac._id)}
                                style={{ borderLeft: ac.uid == currentUser.uid ? '3px solid var(--tint-color)' : 'none' }}
                            >
                                <td>{ac.user.displayName}</td>
                                <td>{moment.duration(ac.averagePace, 'seconds').format('hh:mm:ss')}</td>
                                <td>{ac.distance.toFixed()}</td>
                                <td>{ac.strokeRate}</td>
                                <td>{moment.duration(ac.elapsedTime, 'seconds').format('hh:mm:ss')}</td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
                {!activities.length &&
                    <p className='empty-table-message'>No completed activities</p>
                }
            </div>
        </div>
        
    )
}
