import React from 'react'
import SettingsHeader from './SettingsHeader'
import MainHeader from '../headers/MainHeader'

export default function Profile() {

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/profile' />
            <div className='main-container settings-page'>

            </div>
        </div>
    )
}