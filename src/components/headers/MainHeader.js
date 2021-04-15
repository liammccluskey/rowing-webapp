import React, {useEffect, useState} from "react"
import {useTheme} from "../../contexts/ThemeContext"
import {useAuth} from '../../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import DropdownMenu from './DropdownMenu'

export default function MainHeader(props) {
    const {isDarkMode, setIsDarkMode} = useTheme()
    const {currentUser} = useAuth()
    const [path, setPath] = useState('')
    const history = useHistory()

    const [hideMenu, setHideMenu] = useState(true)
    
    const activeClass = (pathname) => {
        return path.includes(pathname) ? 'link-active' : ''
    }
    useEffect(() => {
        setPath(window.location.pathname.split('/')[1])
    }, [])

    return (
        <div className="d-flex jc-space-between ai-center main-header" style={{...props.style}}>
            <div>
                <div className='d-flex jc-flex-start ai-center'> 
                    <h3 onClick={() => history.push('/dashboard')} className='logo-text'
                        style={{marginRight: 60}}
                    >
                        {process.env.REACT_APP_COMPANY_NAME}
                    </h3>
                    
                    <div className='d-inline-flex jc-flex-start ai-center search-bar'>
                        <i className='bi bi-search' style={{color: 'var(--color-secondary)'}} />
                        <input placeholder='Search' style={{width: '300px', borderColor: 'transparent'}} type='text'/>
                    </div>
                    
                </div>
            </div>
            <div className='d-flex jc-flex-end ai-center'>
                <Link className={`${activeClass('dashboard') } header-link`} to='/dashboard' >
                    Dashboard
                </Link>
                <Link className={`${activeClass('training') } header-link`} to='/training/statistics' >
                    Training
                </Link>
                <Link className={`${activeClass('explore') } header-link`} to='/explore/clubs' >
                    Explore
                </Link>
                <div className='d-flex jc-center ai-center onhover-bc' onClick={() => setHideMenu(false)}
                    style={{cursor: 'pointer', padding: '5px 5px'}} 
                >
                    <img src={currentUser.photoURL} className='user-icon' />
                    <i className='bi bi-chevron-down' />
                </div>
            </div>
            <DropdownMenu hideSelf={hideMenu} setHideSelf={setHideMenu} />
        </div>
    )
}