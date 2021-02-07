import React from 'react'
import SubHeader from '../headers/SubHeader'
import {useAuth} from '../../contexts/AuthContext'

export default function AccountHeader(props) {
    const {currentUser} = useAuth()
    const items = [
        {title: 'Account', path: '/'},
        {title: 'Settings', path: '/settings'}
    ]

    return (
        <SubHeader 
            title={currentUser.displayName}
            path='/account'
            subPath={props.subPath}
            items={items}
        />
    )
}

