import React, {useEffect, useState} from "react"
import {useTheme} from "../../contexts/ThemeContext"
import {Link, useHistory} from 'react-router-dom'

export default function MainHeader(props) {
    const {companyName, companyImgURL} = useTheme()
    const [path, setPath] = useState('')
    const history = useHistory()
    const activeClass = (pathname) => {
        return path.includes(pathname) ? 'link-active' : ''
    }
    useEffect(() => {
        setPath(window.location.pathname.split('/')[1])
    }, [])

    return (
        <div className="d-flex jc-space-between ai-center main-header">
            <div>
                <div className='d-flex jc-flex-start ai-center'>
                    <img className='d-inline'
                        src={companyImgURL}
                        height='30px' width='30px' alt='logo'
                        style={{color: 'black'}}    
                    />
                   <h3 style={{marginLeft:'15px'}} onClick={() => history.push('/dashboard')}className='d-inline'>{companyName}</h3>
                    <input placeholder='Search' style={{width: '300px', marginLeft: '60px'}} type='text'/>
                </div>
            </div>
            <div>
                <ul className='ls-none'>
                    <li className='d-inline'>
                        <Link className={`${activeClass('dashboard') } header-link`} to='/dashboard' >
                            Dashboard
                        </Link>
                    </li>
                    <li className='d-inline'>
                        <Link className={`${activeClass('explore') } header-link`} to='/explore/clubs' >
                            Explore
                        </Link>
                    </li>
                    <li className='d-inline'>
                        <Link className={`${activeClass('account') } header-link`} to='/account' >
                            Account
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}