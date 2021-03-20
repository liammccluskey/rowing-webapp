import React, {useState, useEffect, useRef} from 'react'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Loading from '../misc/Loading'
import Arrow from '../misc/Arrow'
import CustomBar from '../charts/CustomBar'
import CustomLine from '../charts/CustomLine'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Statistics() {
    const {currentUser} = useAuth()
    const [selectedTimeframe, setSelectedTimeframe] = useState(0)
    const [selectedMetric, setSelectedMetric] = useState(0)

    const [stats, setStats] = useState(null)
    const [progressStats, setProgressStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [distanceFilter, setDistanceFilter] = useState('10000')
    const distanceQueryRef = useRef()
    const [prevQueryString, setPrevQueryString] = useState('')
    const [prevQueryReadable, setPrevQueryReadable] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await api.get(`/users/${currentUser.uid}/statistics-general`)
                setStats(res.data)

                const queryString = `gte=0&lte=${distanceFilter}`
                res = await api.get(`users/${currentUser.uid}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQueryReadable('Distance   <=   10,000 m')
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
                [timeframes[selectedTimeframe].key]
                [metrics[selectedMetric].key]
        ]
    }

    function aggregate(metricID) {
        return stats.aggregate
            [timeframes[selectedTimeframe].key]
            [metrics[metricID].key]
    }

    function delta(metricID) {
        return stats.delta
            [timeframes[selectedTimeframe].key]
            [metrics[metricID].key]
    }

    const metrics = {
        0: { key: 'meters', label: 'meters', unit: 'm', graphTitle: 'Meters rowed', formatted: () => aggregate(0).toLocaleString()},
        1: { key: 'time', label: 'seconds', unit: '', graphTitle: 'Hours rowed', 
            formatted: () => moment.duration(Math.round(aggregate(1)), 'seconds').format('h [hour]  m [min]')
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
            labelFreq: 3
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
        let queryReadable
        switch(distanceQueryRef.current.value) {
            case 'gte': 
                queryString = `gte=${distanceFilter}&lte=1000000`
                queryReadable = `Distance   >=   ${distanceFilter.toLocaleString()} m`
                break
            case 'lte': 
                queryString = `gte=0&lte=${distanceFilter}`
                queryReadable = `Distance   <=   ${distanceFilter.toLocaleString()} m`
                break
            case 'e':
                queryString = `gte=${distanceFilter}&lte=${distanceFilter}`
                queryReadable = `Distance   =   ${distanceFilter.toLocaleString()} m`
        }
        // Prevent duplicate queries
        if (queryString !== prevQueryString) {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQueryReadable(queryReadable)
            } catch (error) {
                console.log(error)
            }
        } else {
            // show error message ?
        }
        setTimeout(() => setLoadingSearch(false), 0.5*1000)
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/statistics' />
            <br />
            <br />
            {loading ? 
                <Loading />
                :
                <div 
                    className='main-container'
                    style={{
                        display: 'grid', gap: '40px',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        padding: '0px var(--ps-nav)',
                        marginBottom: '100px'
                    }}
                >
                    <div id='general' style={{gridColumn: '1/4'}}>
                        <div id='general-header' className='d-flex jc-space-between ai-center'>
                            <h3>General</h3>
                            <div 
                                className='d-flex jc-flex-end ai-center'
                                style={{gap: '40px'}}
                            >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 
                                        key={idx}
                                        className={idx === selectedTimeframe ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setSelectedTimeframe(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div 
                            id='general-container'
                            className='float-container'
                            style={{padding: '20px 20px'}}
                        >
                            <div className='d-flex jc-space-between ai-center' >
                                {Object.values(metrics).map((metric, metricID) => (
                                    <div 
                                        key={metricID}
                                        style={{ cursor: 'pointer' , borderRadius: '5px' }}
                                        onClick={() => setSelectedMetric(metricID)}
                                    >
                                        <Arrow color='var(--color-secondary)' direction='right' 
                                            style={{
                                                marginRight: '10px', display: metricID !== selectedMetric && 'none',
                                            }}
                                        />
                                        <h4 
                                            style={{
                                                color: 'var(--color-secondary)',
                                                textTransform: 'capitalize', display: 'inline',
                                                fontWeight: '500'

                                            }}
                                        >
                                                {metric.key}
                                        </h4>
                                       
                                        <h3 style={{ margin: '7px 0px' }} >
                                            {metric.formatted()} 
                                            <small style={{marginLeft: '5px'}}> {metric.unit}</small>
                                        </h3>
                                        {delta(metricID) >= 0 ? 
                                            <h4 style={{color: 'var(--color-success)', display: 'inline'}}>
                                                {`+ ${delta(metricID)}%`}
                                            </h4>
                                            :
                                            <h4 style={{color: 'var(--color-error)', display: 'inline'}}>
                                                {`- ${Math.abs(delta(metricID))}%`}
                                            </h4>
                                        }
                                        <h5 style={{color: 'var(--color-tertiary)', display: 'inline', marginLeft: '10px', marginTop: '7px'}}>
                                            from last {timeframes[selectedTimeframe].key}
                                        </h5>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <br />
                            <h4 style={{color: 'var(--color)', fontWeight: '500'}}>
                                {metrics[selectedMetric].graphTitle}
                            </h4>
                            <br />
                            <CustomBar 
                                height='175px' 
                                labelFreq={timeframes[selectedTimeframe].labelFreq}
                                maxLabelLength={10}
                                showYTicks={true}
                                data={{
                                    labels: timeframes[selectedTimeframe].labels(),
                                    label: metrics[selectedMetric].label,
                                    dataset: plottable(),
                                    backgroundColor: `--color-translucent-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`,
                                    borderColor: `--color-${delta(selectedMetric) >= 0 ? 'green' : 'red'}`
                                }}
                            />
                        </div>
                    </div>
                    <div id='progress' style={{gridColumn: '1/4'}}>
                        <div id='progress-header' className='d-flex jc-space-between ai-center'>
                            <h3>Progress</h3>
                            <div 
                                className='d-flex jc-flex-end ai-center'
                                style={{gap: '40px'}}
                            >
                                {['Week', 'Month', 'Year'].map((item, idx) => (
                                    <h5 
                                        key={idx}
                                        className={idx === selectedTimeframe ? 'menu-option-active' : 'menu-option'}
                                        onClick={() => setSelectedTimeframe(idx)}
                                    >
                                        {item}
                                    </h5>
                                ))}
                            </div>
                        </div>
                        <br />
                        <div style={{padding: '20px 20px'}} className='float-container'>
                            <h3 >Filter Workouts</h3>
                            <br />
                            <form style={{ paddingLeft: '20px'}} onSubmit={handleSubmit}>
                                <div 
                                    className='d-inline-flex jc-flex-start ai-center'
                                    style={{ gap: '10px' }}
                                >
                                    <h4 style={{fontWeight: '500'}}>Distance</h4>
                                    <select ref={distanceQueryRef}>
                                        <option value='lte'>Less than</option>
                                        <option value='e'>Equal to</option>
                                        <option value='gte'>Greater than</option>
                                    </select>
                                    <input 
                                        value={distanceFilter}
                                        onChange={(e) => setDistanceFilter(e.target.value)}
                                        type='number' required/>
                                    <h5 style={{fontWeight: '500'}}>m</h5>
                                </div>
                                <br />
                                <div className='d-flex jc-flex-start ai-center' style={{gap: '10px'}}>
                                    <button type='submit' className='clear-btn-secondary' style={{marginTop: '15px'}}>
                                        Search
                                    </button>
                                    {loadingSearch && <Loading style={{display: 'inline-block', height: '0px'}} />}
                                </div>
                            </form>
                            <br /><br />
                            <h3 style={{ display: 'inline'}} >Pace Trend</h3>
                            <div className='d-inline-flex jc-flex-start ai-center'
                                style={{
                                    gap: '0px',
                                    border: '2px solid var(--bc)',
                                    borderRadius: '5px', marginLeft: '25px',
                                    overflow: 'hidden'
                                }}
                            >
                                <p style={{backgroundColor: 'var(--bc)', padding: '7px 10px', letterSpacing: '1px'}}>Filter</p>
                                <p style={{padding: '7px 5px', whiteSpace: 'pre'}}>{prevQueryReadable}</p>
                            </div>
                            <br /><br />
                            <CustomLine 
                                height='200px' 
                                data={{
                                    label: 'Pace / 500m',
                                    dataset: [...progressStats.plottable[timeframes[selectedTimeframe].key] ],
                                    backgroundColor: '--color-translucent-strava',
                                    borderColor: '--color-strava'
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