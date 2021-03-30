import React, { useState } from 'react'
import SettingsHeader from './SettingsHeader'
import MainHeader from '../headers/MainHeader'
import {useTheme} from '../../contexts/ThemeContext'

export default function Preferences() {
    const {isDarkMode, setIsDarkMode, tintColor, setTintColor, tintColors} = useTheme()

    const [editingTheme, setEditingTheme] = useState(false)
    const [editingTint, setEditingTint] = useState(false)

    function handleThemeChange(e) {
        setIsDarkMode(e.target.value === 'dark')
    }

    function handleTintChange(e) {
        setTintColor(e.target.value)
    }

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/preferences' />
            <div className='main-container settings-page'>
                <br /><br />
                <h3>Appearance</h3>
                <br />
                <div className='settings-list'>
                    <div className='editable-settings-row' onClick={() => setEditingTheme(true)} style={{display: editingTheme&&'none'}}>
                        <h4>Color Theme</h4>
                        <h4>{isDarkMode ? 'Dark' : 'Light'}</h4>
                    </div>
                    <div className='settings-edit-container' hidden={!editingTheme} style={{ marginBottom: editingTheme && 15}}>
                        <div className='settings-edit-header' onClick={() => setEditingTheme(false)}>
                            <h4>Color Theme</h4>
                            <i className='bi bi-pencil' />
                        </div>
                        <br />
                        <div className='d-flex jc-space-between ai-center'>
                            <h4>Color Theme</h4>
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
                        <h4>Tint Color</h4>
                        {tintColors[tintColor].name}
                    </div>
                    <div className='settings-edit-container' hidden={!editingTint} style={{marginBottom: editingTint&&15}}>
                        <div className='settings-edit-header' onClick={() => setEditingTint(false)}>
                            <h4>Tint Color</h4>
                            <i className='bi bi-pencil' />
                        </div>
                        <br />
                        <div className='d-flex jc-space-between ai-center'>
                            <h4>Tint Color</h4>
                            <select value={tintColor} onChange={handleTintChange}>
                                {tintColors.map((tc, idx) => (
                                    <option value={idx}>{tc.name}</option>
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
        </div>
    )
}