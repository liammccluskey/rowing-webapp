import React, {useEffect, useState} from 'react'
import moment from 'moment'
import 'moment-duration-format'
import './c2screen.css'



export default function C2Screen(props) {
    const [activity, setActivity] = useState(props.activity)

    const thinBorder='1px solid #211a3d'
    const border='2px solid #211a3d'
    const thickBorder='5px solid #211a3d'

    useEffect(() => {
        setActivity(props.activity)
    }, [props.activity])

    return (
        <div style={{...props.style, border: '5px solid var(--bc)', borderRadius: '5px', overflow: 'hidden'}}>
            <div 
                style={{ textAlign: 'left', backgroundColor: 'var(--bc)' }}
                className='screen-outer d-flex jc-space-between ai-center'
            >
                <p style={{paddingLeft: '15px'}}>
                    {activity.name}
                </p>
                <button onClick={props.handleClickClose} className='clear-btn-cancel' style={{color: 'var(--color-tertiary)'}}>x</button>
            </div>

            <div className='c2screen' style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                border: '1px solid var(--bc)'
            }}>
                <h5 style={{gridColumn: '1/3', borderRight: border}} className='medium'>
                    {moment.duration(activity.elapsedTime, 'seconds').format('hh:mm:ss')}
                </h5>
                <h5 className='medium'>
                    {activity.strokeRate} <h5 className='small'> s/m</h5>
                </h5>
                <h5 className='big' style={{gridColumn: '1/4', borderBottom: border, borderTop: border}}>
                    {moment.duration(activity.currentPace, 'seconds').format('hh:mm:ss')} 
                    <h5 className='small' style={{display: 'inline'}}>
                        /500m 
                    </h5>
                </h5>
                <h5 className='medium' style={{gridColumn: '1/3', borderRight: border}}>
                    {activity.distance} <h5 className='small' style={{display: 'inline'}}> m</h5>
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