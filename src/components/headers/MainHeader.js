import React, {useEffect, useState} from "react"
import {useTheme} from "../../contexts/ThemeContext"
import {Link, useHistory} from 'react-router-dom'
import DropdownMenu from './DropdownMenu'

export default function MainHeader(props) {
    const {isDarkMode, setIsDarkMode} = useTheme()
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
                <div className='d-flex jc-flex-start ai-center'>
                    <h1
                        onClick={() => history.push('/dashboard')}
                        style={{
                            height: '40px', width: '40px',
                            display: 'inline-block',
                            borderRadius: '10px',
                            backgroundColor: 'var(--tint-color)',
                            color: 'var(--bgc)',
                            fontWeight: '400',
                            display: 'none'
                        }}
                    >
                        
                    </h1>
                    <img height='30px' width='33px'
                        src={isDarkMode ? process.env.REACT_APP_COMPANY_ICON_URL : process.env.REACT_APP_COMPANY_ICON_DARK_URL}
                    />
                    <h3 style={{marginLeft:'10px'}} onClick={() => history.push('/dashboard')}className='d-inline'>Rowa</h3>
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
                        <Link className={`${activeClass('account') } header-link`} to='/account' 
                            onClick={ e => {e.preventDefault(); setHideMenu(false)} }
                        >
                            Account
                        </Link>
                    </li>
                </ul>
                
            </div>
            <DropdownMenu hideSelf={hideMenu} setHideSelf={setHideMenu} />
        </div>
    )
}