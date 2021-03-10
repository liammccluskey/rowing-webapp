import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'

import CustomBar from '../charts/CustomBar'
import {Bar} from 'react-chartjs-2'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function UserInfoCard(props) {
    const {currentUser} = useAuth()
    const history = useHistory()
    const [userStats, setUserStats] = useState({
        week: 0,
        month: 0,
        year: 0
    })
    const dataCellStyle = {color: 'var(--color)', textAlign: 'left'}

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}/stats`)
                setUserStats(res.data)
            } catch (error) {
                console.log(error)
            } 
        }
        fetchData()
    }, [])

    return (
        <div style={{...props.style}}>
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
                    <h3 style={{color: 'var(--color-strava)'}}>{userStats.week} m</h3>
                </div>
                <CustomBar 
                    height='200px' 
                    labelFreq={1}
                    maxLabelLength={1}
                    data={{
                        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        label: 'Meters',
                        dataset: [5,4,8,22,33,5,1],
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
                    <h3 style={{color: 'var(--tint-color)'}}>{userStats.year} m</h3>
                </div>
                <CustomBar
                    height='200px'
                    labelFreq={3}
                    maxLabelLength={3}
                    data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septempber', 'October', 'November', 'December'],
                        label: 'Meters',
                        dataset: [44,33,88,20, 100,230,110,200, 44,33,88,20, 100,230,110,200],
                        backgroundColor: '--tint-color-translucent',
                        borderColor: '--tint-color'
                    }}
                />
            </div>
            <br />
            <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
        </div>
    )
}