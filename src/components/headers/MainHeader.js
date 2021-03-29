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
        <div className="d-flex jc-space-between ai-center main-header" style={props.style}>
            <div>
                <div className='d-flex jc-flex-start ai-center' style={{gap: 50}}>
                    <div className='d-flex jc-center ai-center' style={{gap: 10}}>   
                        <img height='30px' width='33px'
                            src={isDarkMode ? process.env.REACT_APP_COMPANY_ICON_URL : process.env.REACT_APP_COMPANY_ICON_DARK_URL}
                        />
                        <h3 onClick={() => history.push('/dashboard')}className='d-inline'>Rowa</h3>
                    </div>
                    

                    <div className='d-inline-flex jc-flex-start ai-center search-bar'>
                        <i className='bi bi-search' style={{color: 'var(--color-secondary)'}} />
                        <input placeholder='Search' style={{width: '300px', borderColor: 'transparent'}} type='text'/>
                    </div>
                    
                </div>
            </div>
            <div className='d-flex jc-flex-end ai-center' style={{gap: 30}}>
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
                    style={{gap: 10, cursor: 'pointer', padding: '5px 5px'}} 
                >
                    <img src={currentUser.photoURL} height={30} width={30} style={{borderRadius: '50%'}}/>
                    <i className='bi bi-chevron-down' />
                </div>
            </div>
            <DropdownMenu hideSelf={hideMenu} setHideSelf={setHideMenu} />
        </div>
    )
}