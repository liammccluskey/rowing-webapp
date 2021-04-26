import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

export default function AdminCard(props) {
    const history = useHistory()
    const {handleClickMakeOwner, handleClickRevokeAdmin, handleClickRemove} = props.membershipActions

    const actionButtonsVisible = props.myMembership.role >= 1 && props.member.role !== 2
    const transferOwnershipButtonVisible = props.myMembership.role === 2 && props.member.role !== 2

    return (
        <div className='d-flex jc-space-between ai-center member-card'> 
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
            <div>
                {actionButtonsVisible && 
                    <div className='action-buttons d-flex jc-flex-end ai-center'>
                        {transferOwnershipButtonVisible && 
                            <button className='clear-btn-secondary mr-10' onClick={() => handleClickMakeOwner(props.member._id)}>
                                Transfer Ownership
                            </button>
                        }
                        <button className='clear-btn-secondary mr-10' onClick={() => handleClickRevokeAdmin(props.member._id)}>
                            Revoke Admin
                        </button>
                        <button className='error-btn-secondary' onClick={() => handleClickRemove(props.member._id)}>
                            Remove
                        </button>
                    </div>
                }
                {props.member.role === 2 && <h4 className='c-cs'>Owner</h4>}
            </div>
            
        </div>
    )
}