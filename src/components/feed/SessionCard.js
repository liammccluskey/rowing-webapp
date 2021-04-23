import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import C2Results from '../misc/C2Results'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import CommentSection from './CommentSection'


export default function SessionCard(props) {
    const { thisUser } = useAuth()
    const history = useHistory()

    function handleClickSession(session) {
        history.push(`/sessions/${session._id}`)
    }

    return (
        <div className='activity-card float-container'>
            <div className='d-flex jc-flex-start ai-flex-start mb-10'>
                { props.session.club && <img src={props.session.club.iconURL} className='club-icon' />}
                <div>
                    <p className='fw-l mb-2' > {props.session.club.name} </p>
                    <p className='c-cs mb-10'>{moment(props.session.startAt).format('LLL')}</p>
            
                    <h3 className='fw-m page-link' onClick={() => handleClickSession(props.session)}>
                        {props.session.title}
                    </h3>
                </div>
            </div>
            <br />
            <CommentSection parentID={props.session._id} />
        </div>
    )
}

