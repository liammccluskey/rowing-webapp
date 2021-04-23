import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

/*
    - medium sized clickable club icon that routes to club page
    - also displays club name on hover
*/
export default function ClubIcon(props) {
    const history = useHistory()

    const [tooltipHidden, setTooltipHidden] = useState(true)

    function handleClickIcon() {
        history.push(`/clubs/${props.club.customURL}/general`)
    }

    return (
        <div style={props.style} className='tooltip'>
            <div className='tooltip-text'>
                <p> {props.club.name}</p>
            </div>
            <img src={props.club.iconURL} className='club-icon-medium' onClick={handleClickIcon}
            />
        </div>

    )
}
