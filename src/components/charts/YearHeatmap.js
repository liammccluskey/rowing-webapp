import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {useTheme} from '../../contexts/ThemeContext'
import {generate} from '@ant-design/colors'
import {formatUnit} from '../../scripts/Numbers'

/*
    accepts data as an obj of type
    {
        count: total num
        max: max num on a given day
        data: {
            Number(day num) : count on day
        }
    }
*/

export default function YearHeatmap(props) {
    const [data, setData] = useState()
    const [dataRanges, setDataRanges] = useState([])
    const [calendarDays, setCalendarDays] = useState([])
    const [monthStarts, setMonthStarts] = useState([])

    const {themeColor, tintColor} = useTheme()
    const [colors, setColors] = useState( () => getPalette() )
    useEffect(() => {
        setTimeout(() => { // cssVar lags tintColor change
            setColors( () => getPalette() )
        }, 0.01*1000);
    }, [themeColor, tintColor]) 

    function getPalette() {
        const tc = getComputedStyle(document.documentElement).getPropertyValue('--tint-color')
        const palette = generate(tc, {theme: themeColor > 0 ? 'dark' : 'default'})
            .filter( (c, idx) => idx!== 0 && idx % 2 === 0)
        return ['var(--bgc-light)', ...palette ]
    }

    useEffect(() => {
        const dataMax = props.data.max ? props.data.max : 0
        const ranges = dataMax < colors.length ? 
            Array(colors.length).fill(0).map( (e, idx) => ({min: idx, max: idx} ))
            :
            Array(colors.length).fill(0).map( (e, idx) => (
                idx === 0 ? {min: 0, max: 0} : {min: idx*2 - 1, max: idx*2})
            )
        ranges[ranges.length - 1].max = Infinity

        setData(props.data.data ? props.data.data : {})
        setDataRanges(ranges)
    }, [props.data])

    useEffect( () => {
        // Get days in this year
        const val = moment()
        const startDay = val.clone().startOf('year').startOf('week')

        const endDay = val.clone().endOf('year').endOf('week')

        const currDay = startDay.clone().subtract(1,'day')
        let days = []
        while (currDay.isBefore(endDay, 'day')) {
            days.push(currDay.add(1, 'day').clone())
        }
        setCalendarDays(days)

        const months = []
        const startMonth = moment().startOf('year').startOf('month')
        const endMonth = moment().endOf('year').startOf('month')
        const currMonth = startMonth.clone().subtract(1, 'month')
        while (currMonth.isBefore(endMonth, 'month')) {
            months.push(currMonth.add(1, 'month').clone() )
        }
        setMonthStarts(months)
    }, [] )

    function getValue(dayMoment) {
        const dayIndex = dayMoment.dayOfYear()
        return Math.floor(Math.random() * 5)
        return data.hasOwnProperty(dayIndex) ? data[dayIndex] : 0
    }

    function getColor(dayMoment) {
        const val = getValue(dayMoment)
        let color
        dataRanges.forEach( (range, idx) => {
            if (val >= range.min && val <= range.max) {
                color = colors[idx]
            }
        })
        return color
    }

    function getFormattedValue(dayMoment) {
        const val = getValue(dayMoment)
        return `${val} ${formatUnit(props.dataUnit, val)}`
    }

    const border = '1px solid var(--bc-chart)'

    return (
        <div>
            <div style={{display: 'inline-grid', gridTemplateColumns: `repeat(${moment().weeksInYear() + 1}, 1fr)`}}>
                {monthStarts.map( (m, idx) => 
                    <h6 style={{width: 0, gridRow: 1, gridColumn: 2 + m.diff( moment().startOf('year').startOf('week'), 'weeks') }}
                        className='h7 mb-3' key={idx}
                    >
                        {m.format('MMM')}
                    </h6>
                )}
                {['Mon', 'Wed', 'Fri'].map( (day, idx) => 
                    <h6 style={{gridColumn: 1, gridRow: 1 + (idx + 1) * 2, height: 0}} key={idx}
                        className='h7'
                    >
                        {day}
                    </h6>
                )}
                {calendarDays.map( (day, idx) => 
                    <div className='tooltip' key={idx}
                        style={{
                            display: !day.isSame(moment(), 'year') && 'none',
                            backgroundColor: getColor(day),
                            gridRow: 2 + day.day(), gridColumn: 2 + day.diff(moment().startOf('year').startOf('week'), 'weeks'),

                            margin: 0, height: 13,  borderRadius: 0, maxWidth: 30, border: 'none', margin: 0,
                            minWidth: 5,
                            borderLeft: border, borderTop: border
                        }}
                    >
                        <div className='tooltip-text' style={{zIndex: 2}}>
                            <h5>{getFormattedValue(day)} on {day.format('LL')}</h5>
                        </div>
                    </div>
                )}
            </div>
            <div className='mb-15'></div>
            <div className='d-flex jc-flex-start ai-center'>
                <h6 className='mr-5'>Less</h6>
                {colors.map( (c, idx) => 
                    <div key={idx} 
                        style={{height: 15, width: 15, border: border, borderRadius: 3, margin: 5, backgroundColor: c}}
                        className='tooltip'
                    >
                        <div className='tooltip-text'>
                            {dataRanges.length > 0 &&
                                <h5>Range: {dataRanges[idx].min} to {dataRanges[idx].max}</h5>
                            }
                        </div>
                    </div>
                )}
                <h6>More</h6>
            </div>
        </div>
    )
}
