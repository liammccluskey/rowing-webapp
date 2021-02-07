import React from 'react'
import MainHeader from '../headers/MainHeader'
import AccountHeader from './AccountHeader'
import {useAuth} from '../../contexts/AuthContext'


export default function Account() {

    return (
        <div>
            <MainHeader />
            <AccountHeader subPath='/'/>

        </div>
    )
}