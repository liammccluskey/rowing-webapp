import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


export default function SubHeader(props) {

    const activeClass = (pathname) => {
        return props.subPath === pathname ? 'sub-link-active' : ''
    }

    return (
        <div className='sub-header'>
            
            <div style={{lineHeight:'0px'}}className='d-flex jc-space-between ai-center'>
                <p style={{fontSize: '28px', fontWeight: '500', margin: 'none'}}>{props.title}</p>
                {props.imgURL && 
                        <img height='125px' width='125px' style={{marginRight: '10px', borderRadius: '5px'}} src={props.imgURL} />
                }
                
            </div>
            {props.items && props.items.map( item => {
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