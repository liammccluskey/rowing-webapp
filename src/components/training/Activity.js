import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Paginator from '../misc/Paginator'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Activity() {
    const {currentUser} = useAuth()
    const history = useHistory()

    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const [currPage, setCurrPage] = useState(1)
    const [submittedQuery, setSubmittedQuery] = useState(null)

    const [sortedKey, setSortedKey] = useState('createdAt')
    const [sortAscending, setSortAscending] = useState(true)

    const tableColumns = [
        {title: 'Date', key: 'createdAt'},
        {title: 'Session Title', key: 'sessionID'}, // fix this
        {title: 'Activity Title', key: 'title'},
        {title: 'Distance', key: 'distance'},
        {title: 'Time', key: 'elapsedTime'},
        {title: 'Type', key: 'workoutType'}
    ]

    useEffect(() => {
        fetchData( {workoutType: 1}, 1 )
    }, [])

    async function fetchData(query, page) {
        // TODO: convert query obj to querystring
        setLoading(true)
        try {
            const res = await api.get(`/activities/uid/${currentUser.uid}?page=${page}&pagesize=15`)
            console.log(res.data)
            setResults({
                count: res.data.count,
                activities: sortActivities(res.data.activities)
            })
            setCurrPage(page)
            setSubmittedQuery(query)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (! results.count) {return}
        setResults(curr => (
            {
                count: curr.count,
                activities: sortActivities(curr.activities) 
            }
        ))
    }, [sortAscending, sortedKey])

    function sortActivities(inputActivities) {
        if (sortAscending) {
            return inputActivities.sort( (a, b) => a[sortedKey] < b[sortedKey] ? -1 : 1)
        } else {
            return inputActivities.sort( (a, b) => a[sortedKey] > b[sortedKey] ? -1 : 1)
        }
    }

    function onClickPrevious() {
        fetchData(submittedQuery, currPage - 1)
    }

    function onClickNext() {
        fetchData(submittedQuery, currPage + 1)
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/activity' />
            <div className='main-container' style={{marginBottom: 100}}>
                <br />
                <div className='inv-container' style={{padding: '0px 20px'}}>
                    <br />
                    <h3 style={{fontWeight: 500}}>Filter Workouts</h3>

                    <br />
                </div>
                <br />
                <div id='results' className='float-container'>
                    <table style={{width: '100%'}}>
                        <thead>
                            <tr>
                                
                                {tableColumns.map(col => (
                                    <th 
                                        onClick={() => {
                                            setSortedKey(col.key)
                                            setSortAscending(curr => !curr)
                                        }}
                                        className={sortedKey === col.key ? 'th-sortable th-selected' : 'th-sortable'}
                                    >
                                        {col.title}
                                        <div className={!sortAscending && 'rotate-180'} style={{display: 'inline-block', marginLeft: '8px'}}>
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
                        {(!loading && results.count) && results.activities.map((ac, idx) => (
                            <tr key={idx}>
                                <td>{moment(ac.createdAt).format('ll')}</td>
                                <td className='page-link' onClick={() => history.push(`/sessions/${ac.sessionID}`)}>
                                    {ac.session.title}
                                </td>
                                <td>{ac.title}</td>
                                <td>{ac.distance.toLocaleString()}</td>
                                <td style={{letterSpacing: 1}}>{moment.duration(ac.elapsedTime, 'seconds').format('hh:mm:ss')}</td>
                                <td>{ac.workoutType}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <br />
                { (!loading && submittedQuery !== null) &&
                    <Paginator currPage={currPage} resultsCount={results.count} 
                        onClickPrevious={onClickPrevious} onClickNext={onClickNext}
                    />
                }

            </div>
        </div>
    )
}