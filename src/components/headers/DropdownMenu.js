import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useTheme} from '../../contexts/ThemeContext'
import {useAuth} from '../../contexts/AuthContext'

export default function DropdownMenu(props) {
    const {currentUser, signOut} = useAuth()
    const {isDarkMode, setIsDarkMode} = useTheme()
    const history = useHistory()

    const [hideSelf, setHideSelf] = useState(props.hideSelf)

    const border = '1px solid var(--bc)'
    const itemPadding = '14px 25px'
    const itemStyle = {
        cursor: 'pointer', 
        padding: itemPadding,
        gap: '15px'
    }
    const iconStyle={ fontSize: '20px' , color: 'var(--color-secondary)'}

    const tabs = [
        {title: 'Settings', iconName: 'gear', path: '/settings/account'}
    ]

    useEffect(() => {
        setHideSelf(props.hideSelf)
    }, [props.hideSelf])

    return (
        <div hidden={hideSelf} onClick={() => props.setHideSelf(true)}
            style={{
                height: '100vh', width: '100vw', position: 'fixed',
                top: '0px', right: '0px',
                zIndex: '101',
            }} 
            
        >
            <div className='float-container' hidden={hideSelf}
                style={{
                    width: '300px', position: 'fixed', top: '70px', right: '40px',
                    backgroundColor: 'var(--bgc-hover)', zIndex: '102',
                    padding: '0px 0px', textAlign: 'left',
                    backgroundColor: 'var(--bgc-light)', 
                    border: isDarkMode ? '1px solid var(--bc)' : 'none',
                    boxShadow: 'var(--box-shadow-dark)'
                }}
            >
                <div style={{padding: '20px 25px', borderBottom: border }}>
                    <h4 style={{fontWeight: '500'}}>{currentUser.displayName}</h4>   
                </div>

                <div style={{borderBottom: border}}>
                    {tabs.map(tab => (
                        <div className='d-flex jc-flex-start ai-center' style={itemStyle}
                            onClick={() => history.push(tab.path)}
                        >
                            <i class={`bi bi-${tab.iconName}`} style={iconStyle} />
                            <h4>{tab.title}</h4>
                        </div>
                    ))}
                    
                </div>

                <div style={{padding: itemPadding, borderBottom: border}} onClick={() => setIsDarkMode(curr => !curr)}
                    className='d-flex jc-space-between ai-center'
                >
                    <div className='d-flex jc-flex-start ai-center' style={{gap: '15px'}}>
                    <i class="bi bi-moon" style={iconStyle}/>
                        <h4>Night Mode</h4>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(curr => !curr)} />
                        <span class="slider round"></span>
                    </label>
                
                </div>
                <div className='d-flex jc-flex-start ai-center' style={{...itemStyle}}>
                    <i class="bi bi-box-arrow-right" style={iconStyle}/>
                    <h4 >Log Out</h4>
                </div>
                
                
            </div>
        </div>
        
    )
}