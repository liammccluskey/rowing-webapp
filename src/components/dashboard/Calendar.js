import React, {useEffect, useState} from 'react'
import moment from 'moment'

export default function Calendar(props) {
    const [currMoment, setCurrMoment] = useState(moment())
    const [calendarDays, setCalendarDays] = useState([])

    useEffect( () => {
        const val = currMoment.clone()
        const startDay = val.clone().startOf('month').startOf('week')
        const endDay = val.clone().endOf('month').endOf('week')
        const currDay = startDay.subtract(1,'day')
        let days = []
        while (currDay.isBefore(endDay, 'day')) {
            days.push(currDay.add(1, 'day').clone())
        }
        setCalendarDays(days)
    }, [currMoment] )

    return (
        <div>
            <div className='d-flex jc-center ai-space-between' style={{gap: '5px'}}>
                <h4>{currMoment.format('YYYY')}</h4>
                <button 
                    onClick={() => setCurrMoment(currMoment.subtract(1, 'month').clone())}
                    className='clear-btn-cancel'
                >
                    {'<'}
                </button>
                <h4 style={{width: '100px', textAlign: 'center'}}>{currMoment.format('MMMM')}</h4>
                <button 
                    onClick={() => setCurrMoment(currMoment.add(1, 'month').clone())}
                    className='clear-btn-cancel'
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
                gridAutoRows: '110px',
                border: '1px solid var(--bc)',
                borderRadius: '5px',
                margin: 'none'
                }}
                className='calendar'
            >
                {calendarDays.map((day, index) => (
                    <div key={index} className='calendar-card'>
                        <p style={{
                            color: 'var(--color-secondary)', backgroundColor: 'transparent',
                            textTransform: 'uppercase', fontSize: '13px',
                            marginLeft: '5px'
                        }}>
                            {day.format('D')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        
    )
}