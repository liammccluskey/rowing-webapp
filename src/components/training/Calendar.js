import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'
import moment from 'moment'
import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Calendar(props) {
    const [currMoment, setCurrMoment] = useState(moment())
    const [calendarDays, setCalendarDays] = useState([])
    const [sessions, setSessions] = useState([])
    const [data, setData] = useState([])

    const {thisUser} = useAuth()

    useEffect(() => {
        fetchData()
    }, [currMoment])

    useEffect( () => {
        // Get days in this month
        const val = currMoment.clone()
        const startDay = val.clone().startOf('month').startOf('week')
        const endDay = val.clone().endOf('month').endOf('week')
        const currDay = startDay.clone().subtract(1,'day')
        let days = []
        while (currDay.isBefore(endDay, 'day')) {
            days.push(currDay.add(1, 'day').clone())
        }
        setCalendarDays(days)

        // map sessionsData to sessions arr
        const sessions = Array(days.length).fill([])

        if (data.sessions && data.fetchedMoment.isSame(currMoment, 'month')) {
            data.sessions.forEach(session => {
                const idx = moment(session.startAt).diff(startDay, 'days')
                // check if we have this months sessions
                if (idx >= 0 && idx < days.length) {
                    sessions[idx] = [...sessions[idx], session]
                }
            })
        }
        
        setSessions(sessions)
    }, [currMoment, data] )

    async function fetchData() {
        const query = {
            year: currMoment.year(),
            month: currMoment.month(),
            sparse: 1
        }
        const queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&')
        try {
            const res = await api.get(`/sessions/user/${thisUser._id}?${queryString}`)
            setData({
                sessions: res.data,
                fetchedMoment: currMoment.clone()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/calendar' />
            <br /><br />
            <div className='main-container'>

                <div className='d-flex jc-center ai-center' style={{gap: '20px', padding: '5px 0px'}} >
                <h4>{currMoment.format('YYYY')}</h4>

                <div onClick={() => setCurrMoment(currMoment.subtract(1, 'month').clone())}
                    style={{width: '30px', height: '30px', cursor: 'pointer'}} 
                    className='d-flex jc-center ai-center'
                >
                    <i className='bi bi-chevron-left' />
                </div>
                
                <h4 style={{width: '80px', textAlign: 'center'}}>{currMoment.format('MMMM')}</h4>

                <div onClick={() => setCurrMoment(currMoment.add(1, 'month').clone())}
                    style={{width: '30px', height: '30px', cursor: 'pointer'}} 
                    className='d-flex jc-center ai-center'
                >
                    <i className='bi bi-chevron-right' />
                </div>
                    
                </div>
                <div className='float-container'>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 0px' }}
                    >
                        {['sun','mon','tue','wed','thu','fri','sat'].map((day, id) => (
                            <h6 key={id} className='tt-u c-cs'style={{ textAlign: 'center'}}> {day} </h6>
                        ))}
                    </div>
                    <div style={{display: 'grid',gridTemplateColumns:'repeat(7,1fr)',gridAutoRows: '110px'}} className='calendar'>
                        {calendarDays.map((day, index) => (
                            <div key={index} 
                                style={{
                                    padding: '0px 0px', 
                                    backgroundColor: day.isSame(moment(), 'day') && 'var(--tint-color-translucent)',
                                    borderTop: '1px solid var(--bgc-hover)',
                                    overflow: 'scroll'
                                }}
                            >
                                <p style={{padding: '2px 5px',marginBottom: '2px'}}>
                                    {day.format('D')}
                                </p>
                                {sessions[index] && sessions[index].map( (session, i) => (
                                    <Link to={`/sessions/${session._id}`} style={{textDecoration: 'none'}} key={i}>
                                        <h5 className='page-link' 
                                            style={{
                                                borderLeft: '1px solid var(--tint-color)',
                                                padding: '5px 5px',
                                                marginTop: '4px',
                                                fontWeight: '400', fontSize: '12px'
                                        }}>
                                            {session.title}
                                            <p style={{fontSize: '12px', display: 'none'}}>{moment(session.startAt).format('LT')}</p>
                                            
                                        </h5>
                                    </Link>
                                    
                                ))}
                                
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{height: 200}} />
            </div>
        </div>
        
    )
}