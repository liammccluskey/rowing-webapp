import React from 'react'
import MainHeader from '../headers/MainHeader'
import SettingsHeader from './SettingsHeader'

export default function Account() {

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/account' />
        </div>
    )
}