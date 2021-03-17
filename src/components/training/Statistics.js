import React, {useState, useEffect} from 'react'
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
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics-full`)
                setStats(res.data)
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
        0: { key: 'meters', label: 'meters', unit: 'm', graphTitle: 'Meters rowed'},
        1: { key: 'time', label: 'seconds', unit: 'sec', graphTitle: 'Hours rowed'},
        2: { key: 'calories', label: 'calories', unit: 'cal', graphTitle: 'Calories burned'}
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

                                            }
                                        }>
                                                {metric.key}
                                        </h4>
                                       
                                        <h2 
                                            style={{
                                                margin: '7px 0px'
                                            }}
                                        >
                                            {aggregate(metricID).toLocaleString()} 
                                            <small style={{marginLeft: '5px'}}> {metric.unit}</small>
                                        </h2>
                                        {delta(metricID) >= 0 ? 
                                            <h5 style={{color: 'var(--color-success)', display: 'inline'}}>
                                                {`+ ${delta(metricID)}%`}
                                            </h5>
                                            :
                                            <h5 style={{color: 'var(--color-error)', display: 'inline'}}>
                                                {`- ${Math.abs(delta(metricID))}%`}
                                            </h5>
                                        }
                                        <h5 style={{color: 'var(--color-secondary)', display: 'inline', marginLeft: '10px', marginTop: '7px'}}>
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
                            <CustomBar 
                                height='150px' 
                                labelFreq={timeframes[selectedTimeframe].labelFreq}
                                maxLabelLength={10}
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
                            <div className='d-flex jc-flex-start ai-center' style={{gap: '50px'}}>
                                {[
                                    {title: 'Event', options: ['2k', '5k', '10k', '15k']},
                                    {title: 'Metric', options: ['Ave. Pace', 'Power']}
                                ].map((item, i) => (
                                    <div key={i}>
                                        <h4 style={{fontWeight: '500'}}>{item.title}</h4>
                                        <select>
                                            {item.options.map(op => (
                                                <option val={op}>{op}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <CustomLine 
                                height='250px' 
                                data={{
                                    labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                                    label: 'Pace / 500m',
                                    dataset: Array(moment().daysInMonth()).fill(0).map((day, i) => ({
                                        x: i + 1, y: Math.random()*50
                                    })),
                                    backgroundColor: '--color-translucent-strava',
                                    borderColor: '--color-strava'
                                }}
                            />
                        </div>
                    </div>
                
                    <div style={{height: '200px'}}></div>
                </div>
            }
        </div>
    )
}