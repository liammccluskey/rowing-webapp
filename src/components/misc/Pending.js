import React from 'react'
import './pending.css'

export default function Pending(props) {
    return (
        <div style={props.style} className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
}