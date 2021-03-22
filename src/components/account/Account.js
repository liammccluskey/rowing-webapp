import React from 'react'
import MainHeader from '../headers/MainHeader'
import AccountHeader from './AccountHeader'
import {useAuth} from '../../contexts/AuthContext'
import {useHistory} from 'react-router-dom'


export default function Account() {
    const {signOut} = useAuth()
    const history = useHistory()

    async function handleSignOut() {
        try {
            await signOut()
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <MainHeader />
            <AccountHeader subPath='/'/>
            <div style={{height: '150vh'}}></div>

        </div>
    )
}