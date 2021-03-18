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

    const [activities, setActivities] = useState([])

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
            console.log('did sort ascending for :' + props.activityTitle)
            return inputActivities.sort( (a, b) => a[sortedKey] < b[sortedKey] ? -1 : 1)
        } else {
            console.log('did sort descending for :' + props.activityTitle)
            return inputActivities.sort( (a, b) => a[sortedKey] > b[sortedKey] ? -1 : 1)
        }
    }

    function handleClickActivity() {
        // what to do here ? 
        // send to new page with in depth stats on activity ?
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
            </div>

            <div style={{
                display: hideSelf ? 'none': 'block',
                border: '1px solid var(--bc)', borderRadius: '5px',
                margin: '20px 40px 40px 40px'
            }}>
                <table className='data-table' style={{width: '100%'}}>
                    <thead>
                        <tr>
                            {tableColumns.map((col, idx) => (
                                <th 
                                    onClick={() => {
                                        setSortedKey(col.key)
                                        setSortAscending(curr => !curr)
                                    }} 
                                    style={{cursor: 'pointer'}}
                                >
                                    {col.title}
                                    <Arrow 
                                        color='var(--color-tertiary)' 
                                        direction={sortAscending ? 'up' : 'down'}
                                        style={{
                                            opacity: sortedKey !== col.key && '0%',
                                            marginLeft: '15px'
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {activities.length && activities.map((ac, index) => (
                            <tr 
                                key={index} 
                                style={{
                                    borderLeft: ac.uid == currentUser.uid ? '3px solid var(--tint-color)' : 'none'
                                }}
                                onClick={() => handleClickActivity(ac._id)}
                            >
                                <td>{ac.name}</td>
                                <td>{moment.duration(ac.averagePace, 'seconds').format('hh:mm:ss')}</td>
                                <td>{ac.distance.toFixed()}</td>
                                <td>{ac.strokeRate}</td>
                                <td>{moment.duration(ac.elapsedTime, 'seconds').format('hh:mm:ss')}</td>
                            </tr>
                        ))}
                        {!activities.length &&
                            <tr>
                                <td>No completed activities</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}
