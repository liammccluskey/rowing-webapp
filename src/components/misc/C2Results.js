import React, {useEffect, useState} from 'react'
import moment from 'moment'
import 'moment-duration-format'
import './c2screenresults.css'




export default function C2Results(props) {
    const [activity, setActivity] = useState(props.activity)

    const thinBorder='1px solid #0e1e18'
    const border='2px solid #0e1e18'
    const thickBorder='5px solid #0e1e18'

    useEffect(() => {
        setActivity(props.activity)
    }, [props.activity])

    return (
        <div style={props.style} className='c2screen-results-meta'>
            <h5 className='screen-title fw-xl' style={{fontSize: 14}}>View Detail</h5>
            <div className='c2screen-results' style={{ display: 'grid',  gridTemplateColumns: 'repeat(3, 1fr)'}}>
                <h5 style={{gridColumn: '1/3', borderRight: border}} className='medium'>
                    {moment.duration(activity.elapsedTime, 'seconds').format('hh:mm:ss')}
                </h5>

                <h5 className='medium'>
                    {activity.strokeRate}<small className='small'>s/m</small>
                </h5>

                <h5 className='big d-inline' style={{gridColumn: '1/4', borderBottom: border, borderTop: border}}>
                    {moment.duration(activity.currentPace, 'seconds').format('hh:mm:ss')}
                    <small className='small'> ave / 500m </small>
                </h5>

                <h5 className='medium' style={{gridColumn: '1/3', borderRight: border}}>
                    {activity.distance.toFixed()} <small className='small'>m</small>
                </h5>

                <h5 className='medium d-inline' className='medium' style={{gridColumn: '1/4', borderTop: thickBorder}}>
                    {moment.duration(activity.averagePace, 'seconds').format('hh:mm:ss')}
                    <small className='small'> ave /500m </small>
                </h5>
                    
            </div>
        </div>
    )
}