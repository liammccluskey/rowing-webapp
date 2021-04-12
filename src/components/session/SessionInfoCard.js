import React, {useEffect, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function SessionInfoCard(props) {
    const [session, setSession] = useState(props.session)
    const [loading, setLoading] = useState(true)
    const {currentUser, thisUser} = useAuth()

    useEffect(() => {
        setSession(props.session)
    }, [props])
    return (
        <div style={{...props.style}}>
            <h4 style={{fontWeight: '500', marginBottom: '10px'}}>Session Host</h4>
            <div className='d-flex jc-flex-start ai-flex-start' >
                {session.club && <img src={session.club.iconURL} height={50} width={50} className='club-icon' />}
                {!session.club && (
                    session.hostUser.iconURL ? 
                        <img className='user-icon' height={50} width={50} src='user-icon' />
                        :
                        <div className='user-icon-default' style={{height: 50, width: 50}}>
                            <i className='bi bi-person' />
                        </div>
                )}
                <div>
                    <h4 style={{color: 'var(--color-secondary)'}}>
                        {session.club ? session.club.name : session.hostUser.displayName}
                    </h4>
                    <h5 style={{color: 'var(--color-secondary)',marginTop: '10px'}}>
                        {moment(props.session.startAt).calendar()}
                    </h5>
                </div>
            </div>
        </div>
        
    )
}