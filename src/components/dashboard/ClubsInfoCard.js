import React from 'react'
import Loading from '../misc/Loading'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

export default function ClubsInfoCard(props) {
    const history = useHistory()

    return (
        <div style={{...props.style, padding: '20px 0px'}} className='float-container' >
            <h3 style={{marginLeft: '20px'}}>Your Clubs</h3>
            <br />
            <table style={{width: '100%'}}>
                <thead>
                    <tr>
                        <th style={{color: 'var(--color-secondary)'}}>Club</th>
                    </tr>
                </thead>
                <tbody>
                    {!props.clubs ? <Loading /> : props.clubs.map((club, id) => (
                        <tr key={id}>
                            <td className='d-flex jc-flex-start ai-center page-link'
                                onClick={()=>history.push(`/clubs/${club.customURL}/general`)}
                            >
                                <img className='club-icon' src={club.iconURL}/>
                                <p>{club.name}</p>
                            </td>
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