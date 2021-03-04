import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function UserInfoCard(props) {
    const {currentUser} = useAuth()
    const history = useHistory()
    const [userStats, setUserStats] = useState({
        week: '',
        month: '',
        year: ''
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
        <div style={{...props.style, padding: '15px 15px'}} className='float-container'>
            <div className='d-flex jc-flex-start ai-center'>
                <img 
                    height='50px' width='50px' 
                    src={currentUser.photoURL} 
                    style={{borderRadius: '5px', marginRight: '10px'}}
                />
                <h3>{currentUser.displayName}</h3>
            </div>
            <br />
            <table style={{width: '100%'}}>
                <thead>
                    <tr>
                        <th >Period</th>
                        <th >Meters</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>This Week</td>
                        <td style={dataCellStyle}>{userStats.week.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>This Month</td>
                        <td style={dataCellStyle}>{userStats.month.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>This Year</td>
                        <td style={dataCellStyle}>{userStats.year.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table style={{width: '100%'}}>
                <thead>
                    <tr>
                        <th style={{color: 'var(--color-secondary)'}}>Event</th>
                        <th style={{color: 'var(--color-secondary)'}}>Record</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2k</td>
                        <td style={dataCellStyle}>7:01</td>
                    </tr>
                    <tr>
                        <td>5k</td>
                        <td style={dataCellStyle}>19:36</td>
                    </tr>
                    <tr>
                        <td>10k</td>
                        <td style={dataCellStyle}>35:30</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <button style={{display: 'block', margin: '0px auto'}} className='clear-btn-secondary'>View Full Stats</button>
        </div>
    )
}