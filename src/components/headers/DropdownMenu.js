import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useTheme} from '../../contexts/ThemeContext'
import {useAuth} from '../../contexts/AuthContext'

export default function DropdownMenu(props) {
    const {currentUser, thisUser, signOut} = useAuth()
    const {isDarkMode, setIsDarkMode, tintColor, tintColors, setTintColor} = useTheme()
    const history = useHistory()

    const [hideSelf, setHideSelf] = useState(props.hideSelf)

    const border = '1px solid var(--bc)'
    const itemPadding = '12px 25px'
    const itemStyle = {
        cursor: 'pointer', 
        padding: itemPadding
    }
    const iconStyle={ fontSize: '20px' , color: 'var(--color)', marginRight: 15}

    const tabs = [
        {title: 'Profile', iconName: 'person', path: `/athletes/${thisUser._id}`},
        {title: 'Settings', iconName: 'gear', path: '/settings'}
    ]

    useEffect(() => {
        setHideSelf(props.hideSelf)
    }, [props.hideSelf])

    return (
        <div hidden={hideSelf} onClick={() => props.setHideSelf(true)}
            style={{
                height: '100vh', width: '100vw', position: 'absolute',
                top: '0px', right: '0px',
                zIndex: 11
            }} 
            
        >
            <div className='float-container' hidden={hideSelf}
                style={{
                    width: '300px', position: 'fixed', top: '70px', right: '40px',
                    backgroundColor: 'var(--bgc-hover)', zIndex: 20,
                    padding: '0px 0px', textAlign: 'left',
                    backgroundColor: 'var(--bgc-light)', 
                    border: isDarkMode ? '1px solid var(--bc)' : 'none',
                    boxShadow: 'var(--box-shadow-dark)'
                }}
            >
                <div style={{padding: '20px 25px', borderBottom: border }}>
                    <h4 className='fw-s'>{currentUser.displayName}</h4>   
                </div>

                <div style={{borderBottom: border}}>
                    {tabs.map((tab, idx) => (
                        <div key={idx} className='d-flex jc-flex-start ai-center' style={itemStyle}
                            onClick={() => history.push(tab.path)}
                        >
                            <i className={`bi bi-${tab.iconName}`} style={iconStyle} />
                            <p className='fw-s'>{tab.title}</p>
                        </div>
                    ))}
                    
                </div>

                <div style={{padding: itemPadding}} className='d-flex jc-space-between ai-center' >
                    <div className='d-flex jc-flex-start ai-center'>
                        <i className="bi bi-moon" style={iconStyle}/>
                        <p className='fw-s'>Night Mode</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(curr => !curr)}/>
                        <span className="slider round"></span>
                    </label>
                
                </div>
                <div style={{padding: itemPadding, borderBottom: border}} className='d-flex jc-space-between ai-center'>
                    <div className='d-flex jc-flex-start ai-center'>
                        <i className='bi bi-palette' style={iconStyle} />
                        <p className='fw-s'>Tint Color</p>
                    </div>
                    
                    <div className='d-flex jc-flex-end ai-center'>
                        {tintColors.map( (tc, idx) => 
                            <div key={idx} className='tooltip ml-10' onClick={() => setTintColor(idx)}
                                style={{height: 14, width: 14, borderRadius: 5, backgroundColor: `var(--color-${tc.extension})`}} 
                            >
                                <div className='tooltip-text'>
                                    <h6>{tc.name}</h6>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='d-flex jc-flex-start ai-center' style={{...itemStyle}}
                    onClick={signOut}
                >
                    <i className="bi bi-box-arrow-right" style={iconStyle}/>
                    <p className='fw-s'>Log Out</p>
                </div>
            </div>
        </div>
        
    )
}