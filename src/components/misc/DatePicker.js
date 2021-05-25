import React, {useEffect, useState, useRef} from 'react'
import './datepicker.css'
import moment from 'moment'

export default function DatePicker(props) {
    const [currMoment, setCurrMoment] = useState(moment())
    const [calendarDays, setCalendarDays] = useState([])

    const [selectedMoment, setSelectedMoment] = useState(props.initMoment)
    const [selectedPeriod, setSelectedPeriod] = useState(props.initMoment <= 11 ? 'am' : 'pm') 
    const [selectedHour, setSelectedHour] = useState(props.initMoment.hour() % 12)

    const pickerRef = useRef()
    const inputRef = useRef()
    const [pickerHidden, setPickerHidden] = useState(true)
    const [editingHour, setEditingHour] = useState(false)
    const [editingMinute, setEditingMinute] = useState(false)

    useEffect(() => {
        function handleClickOutside(e) {
            if (pickerRef.current && pickerRef.current.contains(e.target)) {return}
            else if (inputRef.current && inputRef.current.contains(e.target)) {
                setPickerHidden(false)
            } else if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setPickerHidden(true)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {document.removeEventListener('click', handleClickOutside)}
    }, [])

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
    }, [currMoment] )

    useEffect(() => {
        const offset = selectedPeriod === 'am' ? 0 : 12
        setSelectedMoment(curr => curr.clone().set({'hour': (selectedHour + offset) % 24}))
    }, [selectedPeriod])

    useEffect(() => {
        props.setMoment(selectedMoment)
    }, [selectedMoment])

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

    function handleClickDay(moment) {
        setSelectedMoment(curr => curr.clone().set({'date': moment.date(), 'year': moment.year(), 'month': moment.month()}))
    }

    function handleClickHour(hour) {
        const offset = selectedPeriod === 'am' ? 0 : 12
        setSelectedHour(hour)
        setSelectedMoment(curr => curr.clone().set({'hour': hour + offset}))
        setEditingHour(false)
    }

    function handleClickMinute(minuteString) {
        setSelectedMoment(curr => curr.clone().set({'minute': Number(minuteString) }))
        setEditingMinute(false)
    }

    return (
        <div style={{...props.style, marginTop: 5}} className='no-select'>
            <div className={`${pickerHidden ? 'date-input' : 'date-input-focus'} d-inline-flex jc-flex-start`}
                onClick={() => setPickerHidden(curr => !curr)} ref={inputRef}
            >
                <div className='d-flex jc-space-between ai-center' style={{padding: '0px 10px', width: 150}}>
                    <h5 className=''>{selectedMoment.format('ddd, MMMM D')}</h5>
                    <h5 className=''>{selectedMoment.format('LT')}</h5>
                </div>
                <i className='bi bi-clock c-tc' />
            </div>
            <div style={{ display: pickerHidden ? 'none' : 'block'}}  className='float-container date-picker' ref={pickerRef}>
                <div className='d-flex jc-center ai-flex-start'>
                    <div className='clear-btn-cancel' 
                        style={{padding: '5px 10px', flex: 1, borderBottom: '1px solid var(--bc)', borderRadius: 0}}
                        onClick={() => setPickerHidden(true)}
                    >
                        Submit</div>
                </div>
                <div style={{ padding: 15}}>
                    <div className='d-flex jc-space-between ai-center'>
                        <div className={editingHour ? 'time-input-focus' : 'time-input'}>
                            <h5 onClick={() => setEditingHour(curr => !curr)} className='input-value'>
                                { selectedHour === 0 ? 12 : selectedHour}
                            </h5>
                            <div className='time-picker' style={{ display: !editingHour && 'none' }}>
                                {Array(12).fill(0).map( (e, idx) => 
                                    <h5 className='time-picker-option' key={idx} style={{padding: '5px 0px'}}
                                        onClick={() => handleClickHour( (idx + 1 ) % 12)}
                                    >
                                        {idx + 1}
                                    </h5>
                                )}
                            </div>
                        </div>
                        
                        <h4 className='fw-l'> : </h4>

                        <div className={editingMinute ? 'time-input-focus' : 'time-input'}>
                            <h5 onClick={() => setEditingMinute(curr => !curr)} className='input-value'>
                                {selectedMoment.minute() === 0 ? '00' : selectedMoment.minute()}
                            </h5>
                            <div className='time-picker' style={{ display: !editingMinute && 'none' }}>
                                {['00', '10', '20', '30', '40', '50' ].map( (e, idx) => 
                                    <h4 className='time-picker-option' key={idx} style={{padding: '9px 0px'}}
                                        onClick={() => handleClickMinute(e)}
                                    >
                                        {e}
                                    </h4>
                                )}
                            </div>
                        </div>
                        <div className='toggle-control'>
                            <h5 className={selectedPeriod === 'am' ? 'toggle-option-selected' : 'toggle-option'}
                                onClick={() => setSelectedPeriod('am')}>AM</h5>
                            <h5 className={selectedPeriod === 'pm' ? 'toggle-option-selected' : 'toggle-option'} 
                                onClick={() => setSelectedPeriod('pm')} >PM</h5>
                        </div>
                    </div>
                </div>
                <div style={{height: 1, borderTop: '1px solid var(--bc)'}}></div>
                <div style={{ width: 282, padding: 15}}>
                    <div className='d-flex jc-space-between ai-center mb-10'>
                        <div className='d-flex jc-flex-start ai-center'>
                            <h4 className='mr-10'>{currMoment.format('MMMM')}</h4>
                            <h4 >{currMoment.format('YYYY')}</h4>
                        </div>
                        <div className='d-flex jc-flex-end ai-center'>
                            <div className='clear-btn-cancel mr-10' style={{padding: 5}} onClick={handleClickToday}>
                                Today
                            </div>
                            <i className='bi bi-chevron-left icon-btn-circle mr-5' onClick={handleClickPrevious} />
                            <i className='bi bi-chevron-right icon-btn-circle' onClick={handleClickNext} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} className='mb-10'>
                            {['s','m','t','w','t','f','s'].map((day, id) => (
                                <h6 key={id} className='tt-u c-ct'style={{ textAlign: 'center'}}> {day} </h6>
                            ))}
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns:'repeat(7,1fr)'}} className='calendar'>
                            {calendarDays.map((day, index) => (
                                <div key={index} className='onhover-bgc-hover' onClick={() => handleClickDay(day)}
                                style={{ 
                                    backgroundColor: day.isSame(selectedMoment, 'day') ? 'var(--tint-color)'
                                        : day.isSame(moment(), 'day') && 'var(--tint-color-translucent)',
                                    borderRadius: 15, textAlign: 'center', padding: '5px 0px', margin: '1px 7px',
                                    cursor: 'pointer'
                                }}>
                                    <h6 style={{ 
                                        color: day.isSame(selectedMoment, 'day') ? 'white'
                                            : day.isSame(moment(), 'day') ? 'var(--tint-color)' : 'var(--color)'
                                    }}>
                                        {day.format('D')} 
                                    </h6>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
        
    )
}