import React, {useEffect, useState} from 'react'
import moment from 'moment'
import 'moment-duration-format'
import './c2screen.css'




export default function C2Results(props) {
    const [activity, setActivity] = useState(props.activity)

    const thinBorder='1px solid #0e1e18'
    const border='2px solid #0e1e18'
    const thickBorder='5px solid #0e1e18'

    useEffect(() => {
        setActivity(props.activity)
    }, [props.activity])

    return (
        <div style={props.style} className='c2screen-meta'>
            <div className='screen-outer d-flex jc-space-between ai-center' style={{display: 'none'}}>
                <h4>
                    {activity.user.displayName}
                </h4>
                <button onClick={props.handleClickClose}>Close</button>
            </div>

            <div className='c2screen' style={{ display: 'grid',  gridTemplateColumns: 'repeat(3, 1fr)'}}>
                <h5 style={{gridColumn: '1/3', borderRight: border}} className='medium'>
                    {moment.duration(activity.elapsedTime, 'seconds').format('hh:mm:ss')}
                </h5>
                <h5 className='medium'>
                    {activity.strokeRate}<h5 className='small'>s/m</h5>
                </h5>
                <h5 className='big' style={{gridColumn: '1/4', borderBottom: border, borderTop: border}}>
                    {moment.duration(activity.currentPace, 'seconds').format('hh:mm:ss')} 
                    <h5 className='small' style={{display: 'inline'}}>
                        /500m 
                    </h5>
                </h5>
                <h5 className='medium' style={{gridColumn: '1/3', borderRight: border}}>
                    {activity.distance.toFixed()}<h5 className='small' style={{display: 'inline'}}>m</h5>
                </h5>
                <h5 className='medium' style={{gridColumn: '1/4', borderTop: thickBorder}}>
                    {moment.duration(activity.averagePace, 'seconds').format('hh:mm:ss')}
                    <h5 className='small' style={{display: 'inline'}}>
                        ave /500m
                    </h5>
                </h5>
            </div>
        </div>
    )
}