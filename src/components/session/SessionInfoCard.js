import React, {useEffect, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import ClubIcon from '../icons/ClubIcon'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function SessionInfoCard(props) {
    const [session, setSession] = useState(props.session)

    useEffect(() => {
        setSession(props.session)
    }, [props])
    return (
        <div style={{...props.style}}>
            <h3 className='mb-20'>
                {session.title}
            </h3>
            <div className='d-flex jc-flex-start ai-flex-start' style={{padding: '0px 10px'}}>
                <div className='mr-10'>
                    {session.club && <ClubIcon club={session.club} />}
                    {!session.club && (
                        session.hostUser.iconURL ? 
                            <img className='user-icon' src={session.hostUser.iconURL} />
                            :
                            <div className='user-icon-default'>
                                <i className='bi bi-person' />
                            </div>
                    )}
                </div>
                
                <div >
                    <p className='c-cs fw-s mb-10'>
                        Host - {session.club ? session.club.name : session.hostUser.displayName}
                    </p>
                    <h5 className='c-cs'>
                        {moment(props.session.startAt).calendar()}
                    </h5>
                </div>
            </div>
        </div>
        
    )
}