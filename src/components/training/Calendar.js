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

    function handleClickPrevious() {
        /* subtract 1 month */
        setCurrMoment(currMoment.subtract(1, 'month').clone())
    }

    function handleClickNext() {
        /* add 1 month */
        setCurrMoment(currMoment.add(1, 'month').clone())
    }

    function handleClickToday() {
        /* set curr moment to today */
        setCurrMoment(moment())
    }

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/calendar' style={{position: 'static'}} />
            <br />
            <div className='main-container' style={{minHeight: '100vh'}}>
                <div className='d-flex jc-space-between ai-center' 
                    style={{padding: '20px 0px' , position: 'sticky', top: 0, backgroundColor: 'var(--bgc)'}} 
                >
                    <div className='d-flex jc-flex-start ai-center'>
                        <h3 className='mr-10'>{currMoment.format('YYYY')}</h3>

                        <div onClick={handleClickPrevious} className='icon-btn' >
                            <i className='bi bi-chevron-left' />
                        </div>
                        <h3 style={{width: 120, textAlign: 'center'}}>{currMoment.format('MMMM')}</h3>
                        <div onClick={handleClickNext} className='icon-btn' >
                            <i className='bi bi-chevron-right' />
                        </div>
                    </div>
                    <button className='clear-btn-secondary' onClick={handleClickToday}>Today</button>
                    
                    
                </div>
                <div className='float-container'>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 0px' }}
                    >
                        {['sun','mon','tue','wed','thu','fri','sat'].map((day, id) => (
                            <h6 key={id} className='tt-u c-cs'style={{ textAlign: 'center'}}> {day} </h6>
                        ))}
                    </div>
                    <div style={{display: 'grid',gridTemplateColumns:'repeat(7,1fr)',gridAutoRows: 110}} className='calendar'>
                        {calendarDays.map((day, index) => (
                            <div key={index} 
                                style={{
                                    padding: '0px 0px', 
                                    backgroundColor: day.isSame(moment(), 'day') && 'var(--tint-color-translucent)',
                                    borderTop: '1px solid var(--bgc-hover)',
                                    overflow: 'scroll'
                                }}
                            >
                                <h6 style={{padding: '2px 5px',marginBottom: '2px'}}>
                                    {day.format('D')}
                                </h6>
                                {sessions[index] && sessions[index].map( (session, i) => (
                                    <Link to={`/sessions/${session._id}`} style={{textDecoration: 'none'}} key={i}>
                                        <h5 className='page-link' 
                                            style={{
                                                borderLeft: '2px solid var(--tint-color)',
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
            </div>
        </div>
        
    )
}
/*
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
            <TrainingHeader subPath='/calendar' style={{position: 'static'}} />
            <br /><br />
            <div className='main-container'>

                <div className='d-flex jc-space-between ai-center' 
                    style={{padding: '20px 0px' , position: 'sticky', top: 0, backgroundColor: 'var(--bgc)'}} 
                >
                    <h3>{currMoment.format('YYYY')}</h3>

                    <div onClick={() => setCurrMoment(currMoment.subtract(1, 'month').clone())} className='clear-icon-btn' >
                        <i className='bi bi-chevron-left' />
                    </div>
                    
                    <h3 style={{width: '100px', textAlign: 'center'}}>{currMoment.format('MMMM')}</h3>

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
                    <div style={{display: 'grid',gridTemplateColumns:'repeat(7,1fr)',gridAutoRows: '100px'}} className='calendar'>
                        {calendarDays.map((day, index) => (
                            <div key={index} 
                                style={{
                                    padding: '0px 0px', 
                                    backgroundColor: day.isSame(moment(), 'day') && 'var(--tint-color-translucent)',
                                    borderTop: '1px solid var(--bgc-hover)',
                                    overflow: 'scroll'
                                }}
                            >
                                <h6 style={{padding: '2px 5px',marginBottom: '2px'}}>
                                    {day.format('D')}
                                </h6>
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

*/