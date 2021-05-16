
import React, { useState } from 'react'
import {useTheme} from '../../contexts/ThemeContext'
import {useMessage} from '../../contexts/MessageContext'
import moment from 'moment'

export default function Preferences() {
    const {isDarkMode, setIsDarkMode, tintColor, setTintColor, tintColors} = useTheme()
    const {setMessage} = useMessage()

    const [editingTheme, setEditingTheme] = useState(false)
    const [editingTint, setEditingTint] = useState(false)

    function handleThemeChange(e) {
        setIsDarkMode(e.target.value === 'dark')
        setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        setEditingTheme(false)
    }

    function handleTintChange(e) {
        setTintColor(e.target.value)
        setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        setEditingTint(false)
    }

    return (
        <div>
            <h3 id='Preferences'>Preferences</h3>
            <br />
            <div className='settings-list'>
                <div className='editable-settings-row' onClick={() => setEditingTheme(true)} style={{display: editingTheme&&'none'}}>
                    <p>Color Theme</p>
                    <div className='d-flex jc-flex-end ai-center'>
                        <i className={`bi bi-${isDarkMode ? 'moon' : 'sun'} mr-10`} style={{fontSize: 20}} />
                        <p>{isDarkMode ? 'Dark' : 'Light'}</p>
                    </div>
                </div>
                <div className='settings-edit-container' hidden={!editingTheme} style={{ marginBottom: editingTheme && 15}}>
                    <div className='settings-edit-header' onClick={() => setEditingTheme(false)}>
                        <p>Color Theme</p>
                        <i className='bi bi-pencil' />
                    </div>
                    <br />
                    <div className='d-flex jc-space-between ai-center'>
                        <p>Color Theme</p>
                        <select value={isDarkMode ? 'dark' : 'light'} onChange={handleThemeChange}>
                            <option value='light'>Light</option>
                            <option value='dark'>Dark</option>
                        </select>
                    </div>
                    <br /><br />
                    <div className='d-flex jc-flex-end'>
                        <button className='clear-btn' onClick={() => setEditingTheme(false)}>Close</button>
                    </div>
                    <br />
                </div>
                <div className='editable-settings-row' onClick={() => setEditingTint(true)} style={{display: editingTint&&'none'}}>
                    <p>Tint Color</p>
                    <div className='d-flex jc-flex-end ai-center'>
                        <div className='mr-10' style={{
                                borderRadius: '50%', height: 18, width: 18,
                                backgroundColor: `var(--color-${tintColors[tintColor].extension}`
                            }}
                        />
                        <p style={{color: `var(--color-${tintColors[tintColor].extension})`}}>
                            {tintColors[tintColor].name}
                        </p>
                    </div>
                    
                </div>
                <div className='settings-edit-container' hidden={!editingTint} style={{marginBottom: editingTint&&15}}>
                    <div className='settings-edit-header' onClick={() => setEditingTint(false)}>
                        <p>Tint Color</p>
                        <i className='bi bi-pencil' />
                    </div>
                    <br />
                    <div className='d-flex jc-space-between ai-center'>
                        <p>Tint Color</p>
                        <select value={tintColor} onChange={handleTintChange}>
                            {tintColors.map((tc, idx) => (
                                <option key={idx} value={idx}>{tc.name}</option>
                            ))}
                        </select>
                    </div>
                    <br /><br />
                    <div className='d-flex jc-flex-end'>
                        <button className='clear-btn' onClick={() => setEditingTint(false)}>Close</button>
                    </div>
                    <br />
                </div>
            </div>
        </div>
    )
}