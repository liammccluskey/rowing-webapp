import React from 'react'
import { Link } from 'react-router-dom'


export default function SubHeader(props) {

    const activeClass = (pathname) => {
        return props.subPath === pathname ? 'sub-link-active' : ''
    }

    return (
        <div className='sub-header' style={props.style}>
            <div className='d-flex jc-space-between ai-center'>
                <h2 style={{marginBottom: 12}}>{props.title}</h2>
            </div>
            <div className='d-flex jc-flex-start' style={{gap: 25}}>
                {props.items && props.items.map( (item, idx) => (
                    <Link key={idx} className={`${activeClass(item.path)} header-link`}
                        to={props.path + item.path}
                        style={{paddingBottom: 11}}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>

    )
}