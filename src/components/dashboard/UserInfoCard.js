
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
        padding: '20px 20px',
        marginBottom: '20px'
    }
    const border = '1px solid var(--bc)'
    

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
            <div >
                <div className='d-flex jc-flex-start ai-center' style={{display: 'none'}}> 
                    <img 
                        height='30px' width='30px' 
                        src={currentUser.photoURL} 
                        style={{borderRadius: '50%', marginRight: '10px'}}
                    />
                    <h3>{currentUser.displayName}</h3>
                </div>
                <div style={style} className='float-container'>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Week</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>
                            {stats.aggregate.weekMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <br />
                    <CustomBar 
                        height='150px' 
                        labelFreq={1}
                        maxLabelLength={1}
                        data={{
                            labels: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                            label: 'Meters',
                            dataset: stats.plottable.weekMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                
                <div style={{...style}} className='float-container'>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Month</h5>
                        <h3 style={{color: 'var(--tint-color)'}}>
                            {stats.aggregate.monthMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <br />
                    <CustomBar 
                        height='150px' 
                        labelFreq={10}
                        maxLabelLength={1}
                        data={{
                            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                            label: 'Meters',
                            dataset: stats.plottable.monthMeters,
                            backgroundColor: '--tint-color-translucent',
                            borderColor: '--tint-color'
                        }}
                    />
                </div>
                
                <div style={{...style}} className='float-container'>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Year</h5>
                        <h3 style={{color: 'var(--color-green)'}}>
                            {stats.aggregate.yearMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <br />
                    <CustomBar
                        height='150px'
                        labelFreq={3}
                        maxLabelLength={3}
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            label: 'Meters',
                            dataset: stats.plottable.yearMeters,
                            backgroundColor: '--color-translucent-green',
                            borderColor: '--color-green'
                        }}
                    />
                </div>
        
                <br />

                <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
                <br />
            </ div>
            }
        </div>
    )
}

/*

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
    

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics`)
                setStats(res.data)
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
            <div
                className='float-container'
                style={{padding: '10px 10px'}}
            >
                <div className='d-flex jc-flex-start ai-center' style={{display: 'none'}}> 
                    <img 
                        height='30px' width='30px' 
                        src={currentUser.photoURL} 
                        style={{borderRadius: '50%', marginRight: '10px'}}
                    />
                    <h3>{currentUser.displayName}</h3>
                </div>
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Week</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>{stats.aggregate.weekMeters} m</h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={1}
                        maxLabelLength={1}
                        data={{
                            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            label: 'Meters',
                            dataset: stats.plottable.weekMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                <br />
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Month</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>{stats.aggregate.monthMeters} m</h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={10}
                        maxLabelLength={1}
                        data={{
                            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                            label: 'Meters',
                            dataset: stats.plottable.monthMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                <br />
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Year</h5>
                        <h3 style={{color: 'var(--tint-color)'}}>{stats.aggregate.yearMeters} m</h3>
                    </div>
                    <CustomBar
                        height='150px'
                        labelFreq={3}
                        maxLabelLength={3}
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            label: 'Meters',
                            dataset: stats.plottable.yearMeters,
                            backgroundColor: '--tint-color-translucent',
                            borderColor: '--tint-color'
                        }}
                    />
                </div>
                <br />
                <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
            </ div>
            }
        </div>
    )
}


/*

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
        padding: '20px 20px',
    }
    const border = '1px solid var(--bc)'
    

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics`)
                setStats(res.data)
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
            <div className='float-container' >
                <div className='d-flex jc-flex-start ai-center' style={{display: 'none'}}> 
                    <img 
                        height='30px' width='30px' 
                        src={currentUser.photoURL} 
                        style={{borderRadius: '50%', marginRight: '10px'}}
                    />
                    <h3>{currentUser.displayName}</h3>
                </div>
                <div style={style}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Week</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>
                            {stats.aggregate.weekMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={1}
                        maxLabelLength={1}
                        data={{
                            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            label: 'Meters',
                            dataset: stats.plottable.weekMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                
                <div style={{...style, borderTop: border }}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Month</h5>
                        <h3 style={{color: 'var(--tint-color)'}}>
                            {stats.aggregate.monthMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={10}
                        maxLabelLength={1}
                        data={{
                            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                            label: 'Meters',
                            dataset: stats.plottable.monthMeters,
                            backgroundColor: '--tint-color-translucent',
                            borderColor: '--tint-color'
                        }}
                    />
                </div>
                
                <div style={{...style, borderTop: border, borderBottom: border}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Year</h5>
                        <h3 style={{color: 'var(--color-green)'}}>
                            {stats.aggregate.yearMeters.toLocaleString()} m
                        </h3>
                    </div>
                    <CustomBar
                        height='150px'
                        labelFreq={3}
                        maxLabelLength={3}
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            label: 'Meters',
                            dataset: stats.plottable.yearMeters,
                            backgroundColor: '--color-translucent-green',
                            borderColor: '--color-green'
                        }}
                    />
                </div>
        
                <br />

                <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
                <br />
            </ div>
            }
        </div>
    )
}

/*

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
    

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/statistics`)
                setStats(res.data)
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
            <div
                className='float-container'
                style={{padding: '10px 10px'}}
            >
                <div className='d-flex jc-flex-start ai-center' style={{display: 'none'}}> 
                    <img 
                        height='30px' width='30px' 
                        src={currentUser.photoURL} 
                        style={{borderRadius: '50%', marginRight: '10px'}}
                    />
                    <h3>{currentUser.displayName}</h3>
                </div>
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Week</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>{stats.aggregate.weekMeters} m</h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={1}
                        maxLabelLength={1}
                        data={{
                            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            label: 'Meters',
                            dataset: stats.plottable.weekMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                <br />
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Month</h5>
                        <h3 style={{color: 'var(--color-strava)'}}>{stats.aggregate.monthMeters} m</h3>
                    </div>
                    <CustomBar 
                        height='150px' 
                        labelFreq={10}
                        maxLabelLength={1}
                        data={{
                            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
                            label: 'Meters',
                            dataset: stats.plottable.monthMeters,
                            backgroundColor: '--color-translucent-strava',
                            borderColor: '--color-strava'
                        }}
                    />
                </div>
                <br />
                <div className='float-container' style={{padding: '10px 10px'}}>
                    <div
                        className='d-flex jc-space-between ai-center'
                    >
                        <h5>This Year</h5>
                        <h3 style={{color: 'var(--tint-color)'}}>{stats.aggregate.yearMeters} m</h3>
                    </div>
                    <CustomBar
                        height='150px'
                        labelFreq={3}
                        maxLabelLength={3}
                        data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            label: 'Meters',
                            dataset: stats.plottable.yearMeters,
                            backgroundColor: '--tint-color-translucent',
                            borderColor: '--tint-color'
                        }}
                    />
                </div>
                <br />
                <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
            </ div>
            }
        </div>
    )
}
*/
