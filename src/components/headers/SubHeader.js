import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


export default function SubHeader(props) {

    const activeClass = (pathname) => {
        return props.subPath === pathname ? 'sub-link-active' : ''
    }

    useEffect(() => {
        console.log(props.subPath)
    })

    return (
        <div className='sub-header'>
            <p style={{fontSize: '28px', fontWeight: '500', margin: 'none'}}>{props.title}</p>
            {props.items.map( item => {
                    return <Link 
                        className={`${activeClass(item.path)} d-inline header-link`}
                        to={props.path + item.path}
                    >
                        {item.title}
                    </Link>
                })
            }
        </div>

    )
}