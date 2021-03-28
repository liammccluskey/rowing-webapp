import React, {useState, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Paginator from '../misc/Paginator'
import Loading from '../misc/Loading'
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

    const [sortedKey, setSortedKey] = useState('createdAt')
    const [sortAscending, setSortAscending] = useState(true)

    const [submittedQuery, setSubmittedQuery] = useState(null)
    const [selectedSortParam, setSelectedSortParam] = useState(0)
    const sortOrderRef = useRef()
    const sortParams = [
        {title: 'Date', key: 'createdAt', description: {                // 0
            asc: 'Oldest to Newest', desc: 'Newest to Oldest'
        }},
        {title: 'Distance', key: 'distance', description: {             // 1
            asc: 'Shortest to Longest', desc: 'Longest to Shortest'
        }},
        {title: 'Workout Time', key: 'elapsedTime', description: {      // 2    
            asc: 'Shortest to Longest', desc: 'Longest to Shortest'
        }},
        {title: 'Average Pace', key: 'averagePace', description: {      // 3
            asc: 'Fastest to Slowest', desc: 'Slowest to Fastest'
        }}
    ]
    const comparators = [
        {title: 'No filter', value: 'none'},
        {title: 'Greater than', value: '$gte'},
        {title: 'Less than', value: '$lte'},
        {title: 'Equal to', value: '$eq'}
    ]
    const filters = [
        {title: 'Distance', key: 'distance', unit: 'm', comparatorRef: useRef('none'), valueRef: useRef(0)},    // 0
        {title: 'Time', key: 'elapsedTime', unit: 'sec', comparatorRef: useRef('none'), valueRef: useRef(0)}    // 1
    ]

    const tableColumns = [
        {title: 'Date', key: 'createdAt'},
        {title: 'Session Title', key: 'sessionID'}, // fix this
        {title: 'Activity Title', key: 'title'},
        {title: 'Distance', key: 'distance'},
        {title: 'Time', key: 'elapsedTime'},
        {title: 'Type', key: 'workoutType'}
    ]

    useEffect(() => {
        fetchData( false, 1 )
    }, [])

    async function fetchData(useSubmittedQuery, page) {
        // TODO: convert query obj to querystring
        setLoading(true)
        const query = useSubmittedQuery ?  submittedQuery :
        {
            pagesize: 15,
            page: page,
            sortby: sortOrderRef.current.value +  sortParams[selectedSortParam].key,
            ...Object.fromEntries(
                filters.filter(filter => filter.comparatorRef.current.value !== 'none')
                .map(filter => [
                    `${filter.key}[${filter.comparatorRef.current.value}]`,
                    filter.valueRef.current.value
                ])
            )
        }
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&')

        try {
            const res = await api.get(`/activities/uid/${currentUser.uid}?${queryString}`)
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
        fetchData(true, currPage - 1)
    }

    function onClickNext() {
        fetchData(true, currPage + 1)
    }

    function handleSubmitForm(e) {
        e.preventDefault()
        fetchData(false, 1)
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/activity' />
            <div className='main-container' style={{marginBottom: 100}}>
                <br />
                <div className='float-container' style={{padding: '0px 20px'}}>
                    <br />
                    <h3 >Filter Workouts</h3>
                    <br />
                    <form onSubmit={handleSubmitForm}>
                        <div className='d-flex jc-flex-start ai-flex-start' style={{gap: 20}}>
                            <label>
                                Sort By <br />
                                <select value={selectedSortParam} onChange={(e) => setSelectedSortParam(e.target.value)}>
                                    {sortParams.map((param, idx) => (
                                        <option key={idx} value={idx}>{param.title}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Order <br />
                                <select ref={sortOrderRef}>
                                    <option value='-' selected={true}>{sortParams[selectedSortParam].description.desc}</option>
                                    <option value='+'>{sortParams[selectedSortParam].description.asc}</option>
                                </select>
                            </label>
                        </div>
                        <br /><br />
                        {filters.map((filter, idx) => (
                            <label key={idx}>
                                {filter.title} <br />
                                <div className='d-flex jc-flex-start ai-center' style={{gap: 15, marginBottom: 15}}>
                                    <select ref={filter.comparatorRef}>
                                        {comparators.map(comparator => (
                                            <option value={comparator.value}>{comparator.title}</option>
                                        ))}
                                    </select>
                                    <input ref={filter.valueRef}/>
                                    {filter.unit}
                                </div>
                                
                            </label>

                        ))}
                        <div className='d-flex jc-space-between ai-center'>
                            <button type='submit' className='solid-btn-secondary'>
                                <i className='bi bi-search' style={{fontSize: 18}} />
                                Search
                            </button>
                            <button type='button' className='clear-btn-cancel'>
                                Cancel
                            </button>
                        </div>
                    </form>
                    <br />
                </div>
                <br />
                {(!loading && submittedQuery !== null) &&
                    <h3 style={{color: 'var(--color-secondary)'}}>{results.count.toLocaleString()} results</h3>
                }
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
                    {loading && <Loading />}
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