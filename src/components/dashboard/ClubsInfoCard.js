import React from 'react'
import Loading from '../misc/Loading'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

export default function ClubsInfoCard(props) {
    const {currentUser} = useAuth()
    const history = useHistory()

    return (
        <div style={{...props.style, padding: '15px 20px'}} className='float-container'>
            <h3>Your Clubs</h3>
            <table style={{width: '100%'}}>
                <thead>
                    <tr>
                        <th style={{color: 'var(--color-secondary)'}}>Club</th>
                        <th style={{color: 'var(--color-secondary)'}}>Members</th>
                    </tr>
                </thead>
                <tbody>
                    {!props.clubs ? <Loading /> : props.clubs.map((club, id) => (
                        <tr key={id}>
                            <td className='d-flex jc-flex-start ai-center' style={{flexWrap: 'nowrap', gap:'5px'}}>
                                <img height='30px' width='30px'
                                    src={club.iconURL}
                                />
                                {club.name}
                            </td>
                            <td style={{textAlign: 'right'}}>{club.memberUIDs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button 
                style={{display: 'block', margin: '0px auto'}} 
                className='clear-btn-secondary'
                onClick={() => history.push('/explore/clubs')}
            >
                Find Clubs
            </button>
        </div>
    )
}