import React from 'react'
import './loading.css'

export default function Loading(props) {

    return (
        <div className='d-flex jc-center' style={{...props.style}}>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
        
    )
}