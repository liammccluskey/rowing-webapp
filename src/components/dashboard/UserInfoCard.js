
import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from 'axios'
import moment from 'moment'

import CustomBar from '../charts/CustomBar'
import {Bar} from 'react-chartjs-2'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function UserInfoCard(props) {
    const {currentUser} = useAuth()
    const history = useHistory()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const style={
        padding: '20px 20px'
    }
    const statsValueStyle = {
        letterSpacing: '1px',
        color: 'var(--color-strava)'
    }

    const graphFillColor = '--color-translucent-strava'
    const graphBorderColor = '--color-strava'

    const timeframeStyle = { color: 'var(--color)'}
    

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics`)
                setStats(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
            } 
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div style={{...props.style}}>
            {loading ? 
            <Loading /> 
            :
            <div className='float-container'>
                <div className='d-flex jc-flex-start ai-center' 
                    style={{borderBottom: '1px solid var(--bc)', padding: '10px 10px'}}
                > 
                    <img height='30px' width='30px' 
                        src={currentUser.photoURL} 
                        style={{borderRadius: '50%', marginRight: '10px'}}
                    />
                    <h4>{currentUser.displayName}</h4>
                </div>
                <div style={style}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5 style={timeframeStyle}>This Week</h5>
                        <h4 style={statsValueStyle}>
                            {stats.aggregate.weekMeters.toLocaleString()} m
                        </h4>
                    </div>
                    <CustomBar 
                        height='115px' 
                        labelFreq={1}
                        maxLabelLength={1}
                        data={{
                            labels: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                            label: 'Meters',
                            dataset: stats.plottable.weekMeters,
                            backgroundColor: graphFillColor,
                            borderColor: graphBorderColor
                        }}
                    />
                </div>
                
                <div style={{...style}} >
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5 style={timeframeStyle}>This Month</h5>
                        <h4 style={statsValueStyle}>
                            {stats.aggregate.monthMeters.toLocaleString()} m
                        </h4>
                    </div>
                    <CustomBar 
                        height='115px' 
                        labelFreq={10}
                        maxLabelLength={1}
                        data={{
                            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                            label: 'Meters',
                            dataset: stats.plottable.monthMeters,
                            backgroundColor: graphFillColor,
                            borderColor: graphBorderColor
                        }}
                    />
                </div>
                
                <div style={{...style}} >
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5 style={timeframeStyle}>This Year</h5>
                        <h4 style={statsValueStyle}>
                            {stats.aggregate.yearMeters.toLocaleString()} m
                        </h4>
                    </div>
                    <CustomBar
                        height='115px'
                        labelFreq={3}
                        maxLabelLength={3}
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            label: 'Meters',
                            dataset: stats.plottable.yearMeters,
                            backgroundColor: graphFillColor,
                            borderColor: graphBorderColor
                        }}
                    />
                </div>
                <div className='d-flex jc-space-around ai-center page-link'
                    style={{padding: '13px 0px', fontSize: '14px', borderTop: '1px solid var(--bc)'}}
                    onClick={() => history.push('/training/statistics')}
                >
                    Your Statistics
                    <i className='bi bi-chevron-right' style={{fontSize: '20px'}} />
                </div>
            </ div>
            }
        </div>
    )
}
