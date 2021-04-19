import React from 'react'
import Loading from '../misc/Loading'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

export default function ClubsInfoCard(props) {
    const history = useHistory()
    const {currentUser} = useAuth()

    function handleClickClub(club) {
        history.push(`/clubs/${club.customURL}/general`)
    }

    return (
        <div style={{...props.style, padding: '20px 20px'}} className='float-container bs-bb' >
            <h3>Your Clubs</h3>
            <br />
            <div className='ai-center' style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30}}>
                {props.clubs && props.clubs.map((club, idx) => (
                    <img key={idx} src={club.iconURL} className='club-icon-medium' onClick={() => handleClickClub(club)} />
                ))}
            </div>
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