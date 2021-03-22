import React, {useState, useEffect, useRef} from 'react'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import Loading from '../misc/Loading'
import Arrow from '../misc/Arrow'
import KebabMenu from '../misc/KebabMenu'
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
                let res = await api.get(`/users/${currentUser.uid}/statistics-general`)
                setStats(res.data)

                const queryString = `gte=0&lte=${distanceFilter}`
                res = await api.get(`users/${currentUser.uid}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQueryReadable('Distance   <=   10,000 m')
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: '<='}))

                console.log(res.data.plottable.month)
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
                const res = await api.get(`/users/${currentUser.uid}/statistics-progress?${queryString}`)
                setProgressStats(res.data)
                setPrevQueryString(queryString)
                setPrevQuery(curr => ({...prevQuery, value: distanceFilter, comparator: distanceComparatorRef.current.value}))
            } catch (error) {
                console.log(error)
            }
        } else {
            // show error message ?
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
                            <h3 style={{fontWeight: '500'}}>General</h3>
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
                                        <p 
                                            style={{
                                                color: 'var(--color-secondary)',
                                                textTransform: 'capitalize', display: 'inline',
                                                fontWeight: '500'

                                            }}
                                        >
                                                {metric.key}
                                        </p>
                                       
                                        <h3 style={{ margin: '6px 0px' }} >
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
                            <h3 style={{fontWeight: '500'}}>Analysis</h3>
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
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '15px'}}>
                                <div className='d-inline-flex jc-flex-start ai-center'
                                    style={{
                                        gap: '0px',
                                        border: '1px solid var(--bc)',
                                        borderRadius: '5px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <h4 style={{backgroundColor: 'var(--bgc-hover)', padding: '7px 10px', color: 'var(--tint-color)'}}>
                                        Workout filter
                                    </h4>
                                    <p style={{padding: '7px 10px', whiteSpace: 'pre'}}>
                                        {prevQuery.metric + '   ' + prevQuery.comparator + '   ' + prevQuery.value.toLocaleString() + ' m'}
                                    </p>
                                </div>
                                <div className='clear-btn-secondary' style={{padding: '4px 8px'}}
                                    onClick={() => setHideFilterForm(false)}
                                >
                                   <i class="bi bi-pencil" style={{fontSize: '25px'}}/>
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
                                <h4 style={{fontWeight: 500}}>Edit Workout Filter</h4>
                                <br />
                                <div 
                                    className='d-inline-flex jc-flex-start ai-center'
                                    style={{ gap: '10px' }}
                                >
                                    <p>Distance</p>
                                    <select ref={distanceComparatorRef}>
                                        <option value='<='>Less than</option>
                                        <option value='='>Equal to</option>
                                        <option value='>='>Greater than</option>
                                    </select>
                                    <input 
                                        value={distanceFilter}
                                        onChange={(e) => setDistanceFilter(e.target.value)}
                                        type='number' required/>
                                    <h5 style={{fontWeight: '500'}}>m</h5>
                                </div>
                                <br />
                                <br />
                                <div className='d-flex jc-space-between ai-center' style={{gap: '10px', marginTop: '10px'}}>
                                    <button type='submit' className='solid-btn-secondary'>
                                        Search
                                    </button>
                                    {loadingSearch && <Loading />}
                                    <button onClick={() => setHideFilterForm(true)}type='button' className='clear-btn-cancel'>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                            <br />

                            <h4 style={{fontWeight: '500'}} >Workout Pace Trend</h4>
                            <br />
                            <CustomLine 
                                height='200px' 
                                data={{
                                    label: 'Pace / 500m',
                                    dataset: [...progressStats.plottable[timeframes[selectedTimeframe].key] ],
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