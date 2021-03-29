import React from 'react'
import SubHeader from '../headers/SubHeader'

export default function SettingsHeader(props) {
    const items = [
        {title: 'Account', path: '/account'},
        {title: 'Profile', path: '/profile'},
        {title: 'Preferences', path: '/preferences'}
    ]

    return (
        <SubHeader 
            title='Settings'
            path='/settings'
            subPath={props.subPath}
            items={items}
        />
    )
}