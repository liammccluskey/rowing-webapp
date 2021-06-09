
import React, {useState, useEffect, useRef} from 'react'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Loading from '../misc/Loading'
import Pending from '../misc/Pending'
import CustomBar from '../charts/CustomBar'
import CustomLine from '../charts/CustomLine'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Statistics() {
    const {thisUser} = useAuth()

    // general stats (top)
    const [timeframe1, setTimeframe1] = useState(1)         // month
    const [selectedMetric, setSelectedMetric] = useState(0) // meters
    
    // analysis stats (bottom)
    const [timeframe2, setTimeframe2] = useState(1)         // month

    const [stats, setStats] = useState(null)
    const [progressStats, setProgressStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [distanceFilter, setDistanceFilter] = useState('10000')
    const distanceComparatorRef = useRef()
    const [prevQueryString, setPrevQueryString] = useState('')
    const [prevQueryReadable, setPrevQueryReadable] = useState('')
    const [prevQuery, setPrevQuery] = useState({
        metric: 'Distance',
        value: 10000,
        comparator: '<='
    })

    const [hideFilterForm, setHideFilterForm] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await api.get(`/users/${thisUser._id}/statistics-general`)
                setStats(res.data)

                const queryString = `gte=0&lte=${distanceFilter}`
                res = await api.get(`users/${thisUser._id}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQueryReadable('Distance   <=   10,000 m')
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: '<='}))
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    function plottable() {
        return [
            ...stats.plottable
                [timeframes[timeframe1].key]
                [metrics[selectedMetric].key]
        ]
    }

    function aggregate(metricID) {
        return stats.aggregate
            [timeframes[timeframe1].key]
            [metrics[metricID].key]
    }

    function delta(metricID) {
        return -1 * stats.delta
            [timeframes[timeframe1].key]
            [metrics[metricID].key]
    }

    const metrics = {
        0: { key: 'meters', label: 'meters', unit: 'm', graphTitle: 'Meters rowed', formatted: () => aggregate(0).toLocaleString()},
        1: { key: 'time', label: 'seconds', unit: '', graphTitle: 'Hours rowed', 
            formatted: () => moment.duration(Math.round(aggregate(1)), 'seconds').format('h [hrs]  m [mins]')
        },
        2: { key: 'calories', label: 'calories', unit: 'cal', graphTitle: 'Calories burned', formatted: () => aggregate(2).toLocaleString()}
    }

    const timeframes = {
        0: { key: 'week',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'week')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'day')) {
                    labels.push(curr.format('M/D'))
                    curr.add(1, 'day')
                }
                return labels
            },
            labelFreq: 1
        },
        1: { key: 'month',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'month')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'day')) {
                    labels.push(curr.format('M/D'))
                    curr.add(1, 'day')
                }
                return labels
            },
            labelFreq: 5
        },
        2: { key: 'year',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'year')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'month')) {
                    labels.push(curr.format('MMM YYYY'))
                    curr.add(1, 'month')
                }
                return labels
            },
            labelFreq: 2
        }
    }

    async function handleSubmit(e) {
        setLoadingSearch(true)
        e.preventDefault()
        let queryString
        switch(distanceComparatorRef.current.value) {
            case '>=': 
                queryString = `gte=${distanceFilter}&lte=1000000`
                break
            case '<=': 
                queryString = `gte=0&lte=${distanceFilter}`
                break
            case '=':
                queryString = `gte=${distanceFilter}&lte=${distanceFilter}`
                break
        }
        // Prevent duplicate queries
        if (queryString !== prevQueryString) {
            try {
                const res = await api.get(`/users/${thisUser._id}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: distanceComparatorRef.current.value}))
            } catch (error) {
                console.log(error)
            }
        }
        setTimeout(() => {
            setLoadingSearch(false)
            setHideFilterForm(true)
        }, 0.5*1000)
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/statistics' />
            <br />
            <br />
            {loading ?  <Loading /> :
                <div 
                    className='main-container statistics-page'
                    style={{
                        display: 'grid', gap: '40px',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        padding: '0px var(--ps-nav)',
                        marginBottom: '100px'
                    }}
                >
                    <div style={{gridColumn: '1/4', marginBottom: -20}}>
                        <div className='d-flex jc-space-between ai-center'>
                            <h3>Overview</h3>
                            <div className='d-flex jc-flex-end ai-center' >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 key={idx} style={{marginLeft: 30}}
                                        className={idx === timeframe1 ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setTimeframe1(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                    </div>

                    {Object.values(metrics).map((metric, metricID) => (
                        <div key={metricID} className='float-container' style={{padding: '10px 20px'}}>
                            <h4 className='c-cs tt-c fw-s mb-5'>{metric.key} </h4>
                            <h3 className='fw-s'>
                                {metric.formatted()} {metric.unit}
                            </h3>
                            <div className='d-flex jc-flex-start ai-center'>
                                <i className={`bi bi-arrow-${delta(metricID) >= 0 ? 'up':'down'}-short mr-5`} 
                                    style={{fontSize: 20, color: delta(metricID) >= 0 ? 'var(--color-green)':'var(--color-red)'}}
                                />
                                <h5 style={{color: delta(metricID) >= 0 ? 'var(--color-green)':'var(--color-red)'}} className='mr-10'>
                                    {Math.abs(delta(metricID))} %
                                </h5>
                                <h6 className='c-cs'>vs last {timeframes[timeframe1].key}</h6>
                            </div>
                        </div>
                    ))}

                    <div id='general' style={{gridColumn: '1/4'}}>
                        <div id='general-container' className='float-container' style={{padding: 20}}>
                            <h3>Meters Rowed</h3>
                            <br />
                            <div>
                                <CustomBar 
                                    height='175px' 
                                    labelFreq={timeframes[timeframe1].labelFreq}
                                    maxLabelLength={10}
                                    showYTicks={true}
                                    data={{
                                        labels: timeframes[timeframe1].labels(),
                                        label: metrics[selectedMetric].label,
                                        dataset: plottable(),
                                        backgroundColor: `--color-translucent-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`,
                                        borderColor: `--color-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div id='progress' style={{gridColumn: '1/4'}}>
                        <div id='progress-header' className='d-flex jc-space-between ai-center'>
                            <h3>Analysis</h3>
                            <div className='d-flex jc-flex-end ai-center' >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 
                                        key={idx} style={{marginLeft: 30}}
                                        className={idx === timeframe2 ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setTimeframe2(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div className='d-flex jc-flex-start'>
                            <div className='d-inline-flex jc-flex-start ai-center mr-20'
                                style={{ border: '1px solid var(--bc)', borderRadius: 5, overflow: 'hidden'}}
                            >
                                <p style={{backgroundColor: 'var(--bgc-light)', padding: '7px 10px'}}
                                    className='mr-10'
                                >
                                    Workout Filter
                                </p>
                                <p style={{padding: '7px 10px', whiteSpace: 'pre'}} className='fw-s'>
                                    {prevQuery.metric + '   ' + prevQuery.comparator + '   ' + prevQuery.value.toLocaleString() + ' m'}
                                </p>
                            </div>
                            <div className='clear-btn-secondary' onClick={() => setHideFilterForm(false)} >
                                <i className="bi bi-pencil"/>
                                Edit filter
                            </div>
                        </div>
                        <div style={{display: hideFilterForm && 'none'}}>
                            <form onSubmit={handleSubmit} className='float-container'
                                style={{ margin: '20px 0px', padding: 20}} 
                            >
                                <h4 >Edit Workout Filter</h4>
                                <br />
                                <div 
                                    className='d-inline-flex jc-flex-start ai-center'
                                >
                                    <p className='mr-10'>Distance</p>
                                    <select ref={distanceComparatorRef} className='mr-20'>
                                        <option value='<='>Less than</option>
                                        <option value='='>Equal to</option>
                                        <option value='>='>Greater than</option>
                                    </select>
                                    <input className='mr-10'
                                        value={distanceFilter}
                                        onChange={(e) => setDistanceFilter(e.target.value)}
                                        type='number' required/>
                                    <h5 style={{fontWeight: '500'}}>m</h5>
                                </div>
                                <br />
                                <br />
                                <div className='d-flex jc-space-between ai-center' style={{ marginTop: '10px'}}>
                                    <button type='submit' className='solid-btn-secondary mr-20'>
                                        <i className='bi bi-search' style={{fontSize: 18}} />
                                        Search
                                    </button>

                                    {loadingSearch && <Pending /> }
                                    {loadingSearch && <p className='c-tc'>Loading results...</p>}
                                    <button onClick={() => setHideFilterForm(true)}type='button' className='clear-btn-cancel'>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                        <br />
                        <div style={{padding: '20px 20px'}} className='float-container'>
                            <h3>Workout Pace Trend</h3>
                            <br />
                            <CustomLine 
                                height='175px' 
                                data={{
                                    label: 'Pace / 500m',
                                    dataset: [...progressStats.plottable[timeframes[timeframe2].key] ],
                                    backgroundColor: '--tint-color-translucent',
                                    borderColor: '--tint-color'
                                }}
                            />
                        </div>
                    </div>
                
                    <div style={{height: '175px'}}></div>
                </div>
            }
        </div>
    )
}

/*
import React, {useState, useEffect, useRef} from 'react'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Loading from '../misc/Loading'
import CustomBar from '../charts/CustomBar'
import CustomLine from '../charts/CustomLine'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Statistics() {
    const {thisUser} = useAuth()

    // general stats (top)
    const [timeframe1, setTimeframe1] = useState(1)         // month
    const [selectedMetric, setSelectedMetric] = useState(0) // meters
    
    // analysis stats (bottom)
    const [timeframe2, setTimeframe2] = useState(1)         // month

    const [stats, setStats] = useState(null)
    const [progressStats, setProgressStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [distanceFilter, setDistanceFilter] = useState('10000')
    const distanceComparatorRef = useRef()
    const [prevQueryString, setPrevQueryString] = useState('')
    const [prevQueryReadable, setPrevQueryReadable] = useState('')
    const [prevQuery, setPrevQuery] = useState({
        metric: 'Distance',
        value: 10000,
        comparator: '<='
    })

    const [hideFilterForm, setHideFilterForm] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await api.get(`/users/${thisUser._id}/statistics-general`)
                setStats(res.data)

                const queryString = `gte=0&lte=${distanceFilter}`
                res = await api.get(`users/${thisUser._id}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQueryReadable('Distance   <=   10,000 m')
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: '<='}))
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    function plottable() {
        return [
            ...stats.plottable
                [timeframes[timeframe1].key]
                [metrics[selectedMetric].key]
        ]
    }

    function aggregate(metricID) {
        return stats.aggregate
            [timeframes[timeframe1].key]
            [metrics[metricID].key]
    }

    function delta(metricID) {
        return -1 * stats.delta
            [timeframes[timeframe1].key]
            [metrics[metricID].key]
    }

    const metrics = {
        0: { key: 'meters', label: 'meters', unit: 'm', graphTitle: 'Meters rowed', formatted: () => aggregate(0).toLocaleString()},
        1: { key: 'time', label: 'seconds', unit: '', graphTitle: 'Hours rowed', 
            formatted: () => moment.duration(Math.round(aggregate(1)), 'seconds').format('h [hrs]  m [mins]')
        },
        2: { key: 'calories', label: 'calories', unit: 'cal', graphTitle: 'Calories burned', formatted: () => aggregate(2).toLocaleString()}
    }

    const timeframes = {
        0: { key: 'week',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'week')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'day')) {
                    labels.push(curr.format('M/D'))
                    curr.add(1, 'day')
                }
                return labels
            },
            labelFreq: 1
        },
        1: { key: 'month',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'month')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'day')) {
                    labels.push(curr.format('M/D'))
                    curr.add(1, 'day')
                }
                return labels
            },
            labelFreq: 5
        },
        2: { key: 'year',
            labels: () => {
                const end = moment()
                const start = end.clone().subtract(1, 'year')
                const labels = []
                const curr = start.clone()
                while (! curr.isAfter(end, 'month')) {
                    labels.push(curr.format('MMM YYYY'))
                    curr.add(1, 'month')
                }
                return labels
            },
            labelFreq: 2
        }
    }

    async function handleSubmit(e) {
        setLoadingSearch(true)
        e.preventDefault()
        let queryString
        switch(distanceComparatorRef.current.value) {
            case '>=': 
                queryString = `gte=${distanceFilter}&lte=1000000`
                break
            case '<=': 
                queryString = `gte=0&lte=${distanceFilter}`
                break
            case '=':
                queryString = `gte=${distanceFilter}&lte=${distanceFilter}`
                break
        }
        // Prevent duplicate queries
        if (queryString !== prevQueryString) {
            try {
                const res = await api.get(`/users/${thisUser._id}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: distanceComparatorRef.current.value}))
            } catch (error) {
                console.log(error)
            }
        }
        setTimeout(() => {
            setLoadingSearch(false)
            setHideFilterForm(true)
        }, 0.5*1000)
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/statistics' />
            <br />
            <br />
            {loading ?  <Loading /> :
                <div 
                    className='main-container statistics-page'
                    style={{
                        display: 'grid', gap: '40px',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        padding: '0px var(--ps-nav)',
                        marginBottom: '100px'
                    }}
                >
                    <div id='general' style={{gridColumn: '1/4'}}>
                        <div id='general-header' className='d-flex jc-space-between ai-center'>
                            <h3 >General</h3>
                            <div className='d-flex jc-flex-end ai-center' >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 key={idx} style={{marginLeft: 30}}
                                        className={idx === timeframe1 ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setTimeframe1(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div id='general-container' className='float-container'>
                            <div className='d-flex jc-space-between ai-center last-div-no-br' 
                                style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', overflow: 'hidden'}} 
                            >
                                {Object.values(metrics).map((metric, metricID) => (
                                    <div key={metricID} onClick={() => setSelectedMetric(metricID)}
                                        className={metricID === selectedMetric ? 'stats-metric-option-selected':'stats-metric-option'}
                                    >
                                        <p className='c-cs tt-c fw-s mb-5'>{metric.key} </p>
                                        <h3 className='fw-s'>
                                            {metric.formatted()} {metric.unit}
                                        </h3>
                                        <div className='d-flex jc-center ai-center'>
                                            <i className={`bi bi-arrow-${delta(metricID) >= 0 ? 'up':'down'}-short mr-5`} 
                                                style={{fontSize: 20, color: delta(metricID) >= 0 ? 'var(--color-green)':'var(--color-red)'}}
                                            />
                                            <h5 style={{color: delta(metricID) >= 0 ? 'var(--color-green)':'var(--color-red)'}}>
                                                {Math.abs(delta(metricID))} %
                                            </h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <div style={{padding: '20px 20px'}}>
                                <CustomBar 
                                    height='175px' 
                                    labelFreq={timeframes[timeframe1].labelFreq}
                                    maxLabelLength={10}
                                    showYTicks={true}
                                    data={{
                                        labels: timeframes[timeframe1].labels(),
                                        label: metrics[selectedMetric].label,
                                        dataset: plottable(),
                                        backgroundColor: `--color-translucent-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`,
                                        borderColor: `--color-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div id='progress' style={{gridColumn: '1/4'}}>
                        <div id='progress-header' className='d-flex jc-space-between ai-center'>
                            <h3>Analysis</h3>
                            <div className='d-flex jc-flex-end ai-center' >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 
                                        key={idx} style={{marginLeft: 30}}
                                        className={idx === timeframe2 ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setTimeframe2(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div style={{padding: '20px 20px'}} className='float-container'>
                            <div className='d-flex jc-flex-start'>
                                <div className='d-inline-flex jc-flex-start ai-center mr-20'
                                    style={{
                                        border: '1px solid var(--bc)',
                                        borderRadius: '5px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <h4 style={{backgroundColor: 'var(--bgc-hover)', padding: '7px 10px'}}
                                        className='mr-10 c-tc'
                                    >
                                        Workout filter
                                    </h4>
                                    <p style={{padding: '7px 10px', whiteSpace: 'pre'}} className='fw-s'>
                                        {prevQuery.metric + '   ' + prevQuery.comparator + '   ' + prevQuery.value.toLocaleString() + ' m'}
                                    </p>
                                </div>
                                <div className='clear-btn-secondary' onClick={() => setHideFilterForm(false)} >
                                   <i className="bi bi-pencil"/>
                                   Edit filter
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}
                                style={{ 
                                    overflow: 'hidden', transform: 'scale(1)',
                                    padding: '0px 20px', 
                                    marginTop: hideFilterForm ? 0 : 20,
                                    opacity: hideFilterForm ? 0: 100,
                                    height: hideFilterForm ? 0 : 210, transition: 'all ease 0.4s',
                                    backgroundColor: 'var(--bgc)', borderRadius: '5px', border: '1px solid var(--bc)'
                                }} 
                                
                            >
                                <br />
                                <h4 >Edit Workout Filter</h4>
                                <br />
                                <div 
                                    className='d-inline-flex jc-flex-start ai-center'
                                >
                                    <p className='mr-10'>Distance</p>
                                    <select ref={distanceComparatorRef} className='mr-20'>
                                        <option value='<='>Less than</option>
                                        <option value='='>Equal to</option>
                                        <option value='>='>Greater than</option>
                                    </select>
                                    <input className='mr-10'
                                        value={distanceFilter}
                                        onChange={(e) => setDistanceFilter(e.target.value)}
                                        type='number' required/>
                                    <h5 style={{fontWeight: '500'}}>m</h5>
                                </div>
                                <br />
                                <br />
                                <div className='d-flex jc-space-between' style={{ marginTop: '10px'}}>
                                    <button type='submit' className='solid-btn-secondary'>
                                        <i className='bi bi-search' style={{fontSize: 18}} />
                                        Search
                                    </button>
                                    {loadingSearch && <Loading />}
                                    <button onClick={() => setHideFilterForm(true)}type='button' className='clear-btn-cancel'>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                            <br />

                            <h4>Workout Pace Trend</h4>
                            <br />
                            <CustomLine 
                                height='200px' 
                                data={{
                                    label: 'Pace / 500m',
                                    dataset: [...progressStats.plottable[timeframes[timeframe2].key] ],
                                    backgroundColor: '--tint-color-translucent',
                                    borderColor: '--tint-color'
                                }}
                            />
                        </div>
                    </div>
                
                    <div style={{height: '175px'}}></div>
                </div>
            }
        </div>
    )
}

*/