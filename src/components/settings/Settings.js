
import React, {useState, useEffect, useCallback} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import Profile from './Profile'
import Preferences from './Preferences'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import Loading from '../misc/Loading'
import moment from 'moment'
import axios from 'axios'

import firebase from "firebase/app"
import "firebase/auth"

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Settings() {
    const {currentUser, thisUser} = useAuth()
    const {setMessage} = useMessage()

    const [profileEmail, setProfileEmail] = useState(currentUser.email)
    const [editingEmail, setEditingEmail] = useState(false)
    const [email, setEmail] = useState(currentUser.email)

    const menuRef = useCallback(node => {
        if (node !== null) {
            setMenuOffset(node.offsetTop - 70)
        }
    }, [])
    const [menuOffset, setMenuOffset] = useState(0)

    async function handleSubmitEmail(e) {
        e.preventDefault()
        try {
            await currentUser.updateEmail(email)
            setProfileEmail(email)
            setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        } catch (error) {
            console.log(error)
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
        setEditingEmail(false)
    }

    async function handleClickResetPassword() {
        try {
            await firebase.auth().sendPasswordResetEmail(currentUser.email)
            setMessage({title: 'Check your email for a reset password link', isError: false, timestamp: moment()})
        } catch (error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
    }

    function handleClickSubscribe() {
        setMessage({
            title: 'We apologize, but this feature is currently in development',
            isError: true,
            timestamp: moment()
        })
    }

    function handleClickDeleteAccount() {
        handleClickSubscribe()
    }

    const settingsGroups = [
        {title: 'Membership'},
        {title: 'Account'},
        {title: 'Profile'},
        {title: 'Preferences'}
    ]

    return (
        <div>
            <MainHeader />
            <SubHeader title='Settings' />
            <div className='main-container settings-page d-flex jc-flex-start ai-flex-start' style={{zIndex: -1}}>
                <div id='settings-menu' className='settings-menu' ref={menuRef} style={{top: menuOffset}}>
                    {settingsGroups.map((group, idx) => (
                        <p key={idx} style={{marginBottom: 15}} className='menu-link'
                            onClick={() => {
                                const elemPos = document.getElementById(group.title).offsetTop
                                window.scrollTo({top: elemPos - 80})
                            }}
                        >
                            {group.title}
                        </p>
                    ))}
                </div>
                <div style={{width: 650, maxWidth: 650, minWidth: 650, marginLeft: 150}}>
                    <h3 id='Membership'>Membership</h3>
                    <br />
                    <div className='settings-list'>
                        <div className='settings-row'>
                            <p>Member Since</p>
                            <p>{moment(thisUser.createdAt).format('LL')}</p>
                        </div>
                        <div className='settings-row'>
                            <p>Subscription</p>
                            <p>None</p>
                            <button className='clear-btn-secondary' onClick={handleClickSubscribe}>Subscribe Now</button>
                        </div>
                    </div>
                    <h3 id='Account'>Account</h3>
                    <br />
                    <div className='settings-list'>
                        <div className='editable-settings-row' style={{display: editingEmail && 'none'}} onClick={() => setEditingEmail(true)}>
                            <p>Email Address</p>
                            <p>{profileEmail}</p>
                        </div>
                        <div className='settings-edit-container' hidden={!editingEmail} style={{ marginBottom: editingEmail && 15}}>
                            <div className='settings-edit-header' onClick={() => setEditingEmail(false)}>
                                <p>Email Address</p>
                                <i className='bi bi-pencil' />
                            </div>
                            <br />
                            <form onSubmit={handleSubmitEmail}>
                                <div className='d-flex jc-space-between ai-center'>
                                    <p>Email Address</p>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
                                </div>
                                <br /><br />
                                <div className='d-flex jc-flex-end'>
                                    <button type='button' className='clear-btn-secondary mr-20' onClick={() => setEditingEmail(false)}>
                                        Cancel
                                    </button>
                                    <button type='submit' className='solid-btn-secondary'>Save</button>
                                </div>
                            </form>
                            <br />
                        </div>
                        <div className='settings-row'>
                            <p>Password</p>
                            <button className='clear-btn-secondary' onClick={handleClickResetPassword}>Reset Password</button>
                        </div>
                        <div className='settings-row'>
                            <p />
                            <button className='error-btn-secondary' onClick={handleClickDeleteAccount}>Delete your account</button>
                        </div>
                    </div>
                    <Profile />
                    <Preferences />
                    <div style={{height: 450}} />
                </div>
            </div>
        </div>
    )
}