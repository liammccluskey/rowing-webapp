import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'

export default function Calendar(props) {
    const [currMoment, setCurrMoment] = useState(moment())
    const [calendarDays, setCalendarDays] = useState([])
    const [sessions, setSessions] = useState([])

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

        // Get this months sessions
        if (!props.sessions.length) {return}
        const sessions = Array(days.length).fill([])
        let i = 0

        // advance pointer to start day
        while (
            i < props.sessions.length && 
            startDay.isAfter(new Date( props.sessions[i].startAt),'day') 
        ) {
            i++ 
        }

        // fill sessions arr
        days.forEach((day, id) => {
            while (
                i < props.sessions.length && 
                day.isSame( new Date( props.sessions[i].startAt ), 'day') 
            ) {
                console.log('day is same')
                sessions[id] = [...sessions[id], props.sessions[i] ]
                i++
            }
        });

        setSessions(sessions)
    }, [currMoment, props.sessions] )

    return (
        <div>
            <div className='d-flex jc-center ai-center' style={{gap: '7px', marginBottom: '10px'}}>
                <h3>{currMoment.format('YYYY')}</h3>
                <button 
                    onClick={() => setCurrMoment(currMoment.subtract(1, 'month').clone())}
                    className='icon-btn'
                >
                    {'<'}
                </button>
                <h3 style={{width: '100px', textAlign: 'center'}}>{currMoment.format('MMMM')}</h3>
                <button 
                    onClick={() => setCurrMoment(currMoment.add(1, 'month').clone())}
                    className='icon-btn'
                >
                    {'>'}
                </button>
                
            </div>
            <div 
                style={{
                    display: 'grid',
                    gap: '0px',
                    gridTemplateColumns: 'repeat(7, 1fr)'
                }}
            >
                {['s','m','t','w','t','f','s'].map((day, id) => (
                    <h6 style={{
                        textTransform: 'uppercase',margin: '0px 0px',
                        padding: '3px', color: 'var(--color-secondary)',
                        textAlign: 'center'
                    }}>
                        {day}
                    </h6>
                ))}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns:'repeat(7,1fr)',
                gap: '0px',
                gridAutoRows: '110px',
                border: '1px solid var(--bc)',
                borderRadius: '10px',
                margin: 'none',
                borderCollapse: 'collapse'
                }}
                className='calendar'
            >
                {calendarDays.map((day, index) => (
                    <div 
                        key={index} 
                        className='calendar-card' 
                        style={{padding: '0px 0px', borderLeft: '1px solid var(--bc)'}}
                    >
                        <p style={{
                            color: 'var(--color-secondary)',
                            textTransform: 'uppercase', fontSize: '13px',
                            padding: '2px 5px',
                            /*backgroundColor: day.isSame(new Date(), 'day') ? 'var(--tint-color-translucent)' : 'transparent',*/
                            marginBottom: '2px',
                        }}>
                            {day.format('D')}
                        </p>
                        {sessions[index] && sessions[index].map( (session, i) => (
                            <Link to={`/sessions/${session._id}`} style={{textDecoration: 'none'}}>
                                <h5 className='page-link' 
                                    style={{
                                        borderLeft: '0px solid var(--tint-color)',
                                        padding: '5px 5px',
                                        marginTop: '4px',
                                        fontWeight: '400',
                                        color: 'var(--color)'
                                }}>
                                    <p style={{fontSize: '12px'}}>{moment(session.startAt).format('LT')}</p>
                                    {session.title}
                                </h5>
                            </Link>
                            
                        ))}
                        
                    </div>
                ))}
            </div>
        </div>
        
    )
}