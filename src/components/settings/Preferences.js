import React from 'react'
import SettingsHeader from './SettingsHeader'
import MainHeader from '../headers/MainHeader'

export default function Preferences() {

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/preferences' />
        </div>
    )
}