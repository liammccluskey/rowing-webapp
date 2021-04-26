import React from 'react'
import { Link } from 'react-router-dom'


export default function SubHeader(props) {

    const activeClass = (pathname) => {
        return props.subPath === pathname ? 'sub-link-active' : ''
    }

    return (
        <div className='sub-header' style={props.style}>
            <div className='d-flex jc-space-between ai-center'>
                <div className='d-flex jc-flex-start ai-center' 
                    style={{marginTop: props.iconURL && -20, marginBottom: 12}}
                >
                    {props.iconURL && 
                        <img height={60} width={60} src={props.iconURL} 
                            style={{
                                border: '0px solid var(--bc)', borderRadius: '5px',
                                marginRight: 10, objectPosition: 'center', objectFit: 'cover'
                            }} 
                        />
                    }
                    <h2>{props.title}</h2>
                </div>
                <div className='d-flex jc-flex-end ai-center'>
                    {props.children}
                </div>
            </div>
            <div className='d-flex jc-flex-start'>
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