import React, {useEffect, useState} from 'react'
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
            <div className='d-flex jc-center ai-center' style={{gap: '7px'}}>
                <h4>{currMoment.format('YYYY')}</h4>
                <button 
                    onClick={() => setCurrMoment(currMoment.subtract(1, 'month').clone())}
                    className='icon-btn'
                >
                    {'<'}
                </button>
                <h4 style={{width: '100px', textAlign: 'center'}}>{currMoment.format('MMMM')}</h4>
                <button 
                    onClick={() => setCurrMoment(currMoment.add(1, 'month').clone())}
                    className='icon-btn'
                >
                    {'>'}
                </button>
            </div>
            <div style={{
                display: 'grid',
                gap: '0px',
                gridTemplateColumns: 'repeat(7, 1fr)'
            }}>
                {['s','m','t','w','t','f','s'].map((day, id) => (
                    <h6 style={{
                        textTransform: 'uppercase',margin: '0px 0px',
                        padding: '3px', borderTop: '1px solid var(--bc)',
                        textAlign: 'center'
                    }}>{
                        day}
                    </h6>
                ))}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns:'repeat(7,1fr)',
                gap: '0px',
                gridAutoRows: '100px',
                border: '1px solid var(--bc)',
                borderRadius: '5px',
                margin: 'none'
                }}
                className='calendar'
            >
                {calendarDays.map((day, index) => (
                    <div key={index} className='calendar-card' style={{padding: '0px 0px'}}>
                        <p style={{
                            color: 'var(--color-secondary)',
                            textTransform: 'uppercase', fontSize: '13px',
                            padding: '2px 5px',
                            backgroundColor: day.isSame(new Date(), 'day') ? 'var(--tint-color-translucent' : 'transparent',
                            borderRadius: '0px'
                        }}>
                            {day.format('D')}
                        </p>
                        {sessions[index] && sessions[index].map( (session, i) => (
                            <h5 style={{
                                borderLeft: '5px solid var(--tint-color)',
                                paddingLeft: '2px',
                                marginTop: '4px'
                            }}>
                                {session.title}
                            </h5>
                        ))}
                        
                    </div>
                ))}
            </div>
        </div>
        
    )
}