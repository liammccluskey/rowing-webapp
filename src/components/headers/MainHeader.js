import React, {useEffect, useState} from "react"
import {useTheme} from "../../contexts/ThemeContext"
import {useAuth} from '../../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import DropdownMenu from './DropdownMenu'

export default function MainHeader(props) {
    const {isDarkMode, setIsDarkMode} = useTheme()
    const {currentUser, thisUser} = useAuth()
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
                    <img src='/images/logo-0.png' height={35} width={35} className='mr-10' style={{borderRadius: '50%'}} />
                    <h3 onClick={() => history.push('/dashboard')} className='logo-text' 
                        style={{marginRight: 40}}
                    >
                        {process.env.REACT_APP_COMPANY_NAME}
                    </h3>
                    <div className='d-inline-flex jc-flex-start ai-center search-bar' style={{display: 'none'}}>
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
                <div className='d-flex jc-center ai-center' onClick={() => setHideMenu(false)}
                    style={{cursor: 'pointer'}} 
                >
                    {thisUser.iconURL ? 
                        <img src={thisUser.iconURL} className='user-icon' style={{marginRight: 10}} />
                        :
                        <div className='user-icon-default'>
                            <i className='bi bi-person' />
                        </div>
                    }
                </div>
            </div>
            <DropdownMenu hideSelf={hideMenu} setHideSelf={setHideMenu} />
        </div>
    )
}