import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import C2Results from '../misc/C2Results'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
import CommentSection from './CommentSection'

export default function ActivityCard(props) {
    const { thisUser } = useAuth()
    const { setMessage } = useMessage()
    const history = useHistory()

    function handleClickSession(session) {
        history.push(`/sessions/${session._id}`)
    }

    function handleClickUser(user) {
        if (user._id === thisUser._id) {return}
        history.push(`/athletes/${user._id}`)
    }

    function handleClickActivity(activity) {
        setMessage({title: 'The page for individual activities is currently in development', isError: true, timestamp: moment()})
    }

    return (
        <div className='activity-card float-container'>
            <div className='d-flex jc-flex-start ai-flex-start mb-10'>
                {props.activity.user.iconURL && <img src={props.activity.user.iconURL} className='user-icon' />}
                {!props.activity.user.iconURL && 
                    <div className='user-icon-default'>
                        <i className='bi bi-person'/>
                    </div>
                }
                <div>
                    <p className='fw-l mb-2 page-link' onClick={() => handleClickUser(props.activity.user)}>
                        {props.activity.user.displayName}
                    </p>
                    <p className='c-cs mb-2'>{moment(props.activity.createdAt).format('LLL')}</p>
                    <p className='page-link mb-20' onClick={() => handleClickSession(props.activity.session)}>
                        {props.activity.session.title}
                    </p>
                    <h3 className='fw-m page-link' onClick={() => handleClickActivity(props.activity)}>
                        {props.activity.session.workoutItems[props.activity.workoutItemIndex]}
                    </h3>
                    
                </div>
            </div>
            <div className='d-flex jc-center' >
                <C2Results activity={props.activity} style={{width: 230}} />
            </div>
            <br />
            <CommentSection parentID={props.activity._id} />
        </div>
    )
}

