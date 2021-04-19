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
    const {thisUser} = useAuth()
    const history = useHistory()

    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const [hideFilterForm, setHideFilterForm] = useState(true)
    const [currPage, setCurrPage] = useState(1)

    const [sortedKey, setSortedKey] = useState('createdAt')
    const [sortAscending, setSortAscending] = useState(true)

    const [submittedQuery, setSubmittedQuery] = useState(null)
    const [submittedQueryString, setSubmittedQueryString] = useState(null)
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
            const res = await api.get(`/activities/search?user=${thisUser._id}&${queryString}`)
            setResults({
                count: res.data.count,
                activities: sortActivities(res.data.activities)
            })
            setCurrPage(page)
            setSubmittedQuery(query)
            setSubmittedQueryString(queryString)
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
        .then(setTimeout(() => {
            setHideFilterForm(true)
        }, 0.5*1000))
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/activity' />
            <div className='main-container' style={{marginBottom: 100}}>
                <br /><br />
                <h3>Workout Filter</h3>
                <br />
                <div className='d-flex jc-flex-start ai-center'>
                    <div className='d-inline-flex jc-flex-start ai-center mr-20'
                        style={{
                            gap: '0px',
                            border: '1px solid var(--bc)',
                            borderRadius: '5px',
                            overflow: 'hidden'
                        }}
                    >
                        <p style={{backgroundColor: 'var(--bgc-light)', padding: '7px 10px'}}>
                            Showing results for
                        </p>
                        <p style={{padding: '7px 10px', whiteSpace: 'pre'}}>
                            {submittedQueryString}
                        </p>
                    </div>
                    <div className='clear-btn-secondary' style={{padding: '4px 8px'}}
                        onClick={() => setHideFilterForm(false)}
                    >
                        <i className="bi bi-pencil" style={{fontSize: '25px'}}/>
                    </div>
                </div>
                <form onSubmit={handleSubmitForm} className='bgc-container'
                    style={{ 
                        overflow: 'hidden', transform: 'scale(1)',
                        padding: '0px 20px', 
                        marginTop: hideFilterForm ? 0 : 20,
                        opacity: hideFilterForm ? 0: 100,
                        height: hideFilterForm ? 0 : 400, transition: 'all ease 0.4s',
                    }} 
                >
                    <br />
                    <h4 style={{fontWeight: 500}}>Edit Workout Filter</h4>
                    <br />
                    <div className='d-flex jc-flex-start ai-flex-start' >
                        <label className='mr-20'>
                            Sort By <br />
                            <select value={selectedSortParam} onChange={(e) => setSelectedSortParam(e.target.value)}>
                                {sortParams.map((param, idx) => (
                                    <option key={idx} value={idx}>{param.title}</option>
                                ))}
                            </select>
                        </label>
                        <label className='mr-20'>
                            Order <br />
                            <select ref={sortOrderRef}>
                                <option value='-' defaultValue={true}>{sortParams[selectedSortParam].description.desc}</option>
                                <option value='+'>{sortParams[selectedSortParam].description.asc}</option>
                            </select>
                        </label>
                    </div>
                    <br />
                    {filters.map((filter, idx) => (
                        <label key={idx} >
                            {filter.title} <br />
                            <div className='d-flex jc-flex-start ai-center' style={{ marginBottom: 15}}>
                                <select ref={filter.comparatorRef} className='mr-20'>
                                    {comparators.map(comparator => (
                                        <option value={comparator.value}>{comparator.title}</option>
                                    ))}
                                </select>
                                <input ref={filter.valueRef} className='mr-10'/>
                                {filter.unit}
                            </div>
                            
                        </label>

                    ))}
                    <br />
                    <div className='d-flex jc-space-between'>
                        <button type='submit' className='solid-btn-secondary'>
                            <i className='bi bi-search' style={{fontSize: 18}} />
                            Search
                        </button>
                        <button type='button' className='clear-btn-cancel' onClick={() => setHideFilterForm(true)}>
                            Cancel
                        </button>
                    </div>
                </form>
                <br />
                {(!loading && submittedQuery !== null) &&
                    <h4 style={{color: 'var(--color-secondary)'}}>{results.count.toLocaleString()} results</h4>
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
                                        <div className={!sortAscending ? 'rotate-180' : ''} style={{display: 'inline-block', marginLeft: '8px'}}>
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
                        {(!loading && results.count > 0) && results.activities.map((ac, idx) => (
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
                    {( (submittedQuery && !loading && !results.activities.length) &&
                        <div style={{textAlign: 'center', fontSize: 17, color: 'var(--color-secondary)', padding: '50px 0px'}}>
                            We couldn't find any activities matching those filters
                        </div>
                    )}
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