import React from 'react'
import {useHistory} from 'react-router-dom'
import ClubIcon from '../icons/ClubIcon'

export default function ClubsInfoCard(props) {
    const history = useHistory()

    return (
        <div style={{...props.style, padding: '20px 0px'}} className='float-container bs-bb' >
            <h3 style={{padding: '0px 20px'}}>Your Clubs</h3>
            <div className='d-flex jc-flex-start ai-flex-start fw-wrap'>
                {props.clubs && props.clubs.map( (club, idx) => 
                    <ClubIcon club={club} key={idx} style={{margin: '20px 20px'}} />
                )}
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