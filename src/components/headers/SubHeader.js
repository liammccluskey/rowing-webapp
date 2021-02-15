import React from 'react'
import { Link } from 'react-router-dom'


export default function SubHeader(props) {

    const activeClass = (pathname) => {
        return props.subPath === pathname ? 'sub-link-active' : ''
    }

    return (
        <div className='sub-header'>
            
            <div className='d-flex jc-space-between ai-center'>
                
                <h2 style={{margin: '6px 0px'}}>{props.title}</h2>
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