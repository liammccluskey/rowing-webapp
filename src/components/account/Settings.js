import React from 'react'
import MainHeader from '../headers/MainHeader'
import AccountHeader from './AccountHeader'
import {useAuth} from '../../contexts/AuthContext'


export default function Settings() {

    return (
        <div>
            <MainHeader />
            <AccountHeader subPath='/settings'/>
            
        </div>
    )
}