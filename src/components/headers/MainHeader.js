import React, {useEffect, useState} from "react"
import {useTheme} from "../../contexts/ThemeContext"
import {Link, useHistory} from 'react-router-dom'

export default function MainHeader(props) {
    const {isDarkMode, setIsDarkMode} = useTheme()
    const [path, setPath] = useState('')
    const history = useHistory()
    const activeClass = (pathname) => {
        return path.includes(pathname) ? 'link-active' : ''
    }
    useEffect(() => {
        setPath(window.location.pathname.split('/')[1])
    }, [])

    return (
        <div className="d-flex jc-space-between ai-center main-header" style={props.style}>
            <div>
                <div className='d-flex jc-flex-start ai-center'>
                    <h1
                        onClick={() => history.push('/dashboard')}
                        style={{
                            height: '40px', width: '40px',
                            display: 'inline-block',
                            borderRadius: '10px',
                            backgroundColor: 'var(--tint-color)',
                            color: 'var(--bgc)',
                            fontWeight: '400'
                        }}
                    >
                        R
                    </h1>
                    <h3 style={{marginLeft:'10px'}} onClick={() => history.push('/dashboard')}className='d-inline'></h3>
                    <input placeholder='Search' style={{width: '300px', marginLeft: '60px'}} type='text'/>
                </div>
            </div>
            <div className='d-flex ai-center'>
                <ul className='ls-none d-inline'>
                    <li className='d-inline'>
                        <Link className={`${activeClass('dashboard') } header-link`} to='/dashboard' >
                            Dashboard
                        </Link>
                    </li>
                    <li className='d-inline'>
                        <Link className={`${activeClass('training') } header-link`} to='/training/statistics' >
                            Training
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
                <button 
                    className='icon-btn d-inline' style={{color: 'var(--color-secondary)'}}
                    onClick={() => setIsDarkMode(curr => !curr)}
                >
                    <i className={isDarkMode ? 'gg-sun' : 'gg-moon'} />
                </button>
            </div>
        </div>
    )
}