import React from 'react'
import { useHistory } from 'react-router-dom'

export default function PendingMemberCard(props) {
    const history = useHistory()
    const {handleClickAcceptRequest, handleClickDeclineRequest} = props.membershipActions

    const actionButtonsVisible = props.myMembership.role >= 1 && props.member.role !== 2

    return (
        <div className='d-flex ai-center jc-space-between member-card'>
            <div className='d-flex jc-flex-start ai-center'> 
                {props.member.iconURL ? 
                    <img className='user-icon d-inline' src={props.member.iconURL} />
                    :
                    <div className='user-icon-default'>
                        <i className='bi bi-person' />
                    </div>
                }
                <h4 className='page-link' onClick={() => history.push(`/athletes/${props.member._id}`)}>
                    {props.member.displayName}
                </h4>
            </div>
            {actionButtonsVisible && 
                <div className='action-buttons d-flex jc-flex-end ai-center'>
                    <button className='solid-btn-secondary mr-20' onClick={() => handleClickAcceptRequest(props.member._id)}>
                        Accept
                    </button>
                    <button className='error-btn-secondary' onClick={() => handleClickDeclineRequest(props.member._id)}>
                        Decline
                    </button>
                </div>
            }
            
        </div>
    )
}