import React from 'react'
import './loading.css'

export default function Loading() {

    return (
        <div className='d-flex jc-center'>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
        
    )
}