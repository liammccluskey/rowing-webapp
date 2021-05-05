import React from 'react'
import {useHistory} from 'react-router-dom'
import ClubIcon from '../icons/ClubIcon'

export default function ClubsInfoCard(props) {
    const history = useHistory()

    return (
        <div style={{...props.style, padding: '20px 20px'}} className='float-container bs-bb' >
            <h3>Your Clubs</h3>
            <br />
            <div className='d-flex jc-space-around ai-flex-start fw-wrap'>
                {props.clubs && props.clubs.map( (club, idx) => 
                    <ClubIcon club={club} key={idx} style={{margin: '10px 10px'}} />
                )}
            </div>
            <br />
            <div className='d-flex jc-center'>
                <button className='clear-btn-secondary' style={{flex: 1}} onClick={() => history.push('/explore/clubs')}>
                    Find Clubs
                </button>
            </div>
            
        </div>
    )
}