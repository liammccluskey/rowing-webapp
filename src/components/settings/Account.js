import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import SettingsHeader from './SettingsHeader'
import {useAuth} from '../../contexts/AuthContext'
import {useTheme} from '../../contexts/ThemeContext'
import Loading from '../misc/Loading'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Account() {
    const {currentUser} = useAuth()
    const {isDarkMode} = useTheme()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [editingEmail, setEditingEmail] = useState(false)
    const [email, setEmail] = useState(currentUser.email)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${currentUser.uid}`)
                setUserData(res.data)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    })

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/account' />
            {loading ? <Loading /> :
            <div className='main-container settings-page'>
                <br /><br />
                <h3>Membership</h3>
                <br />
                <div className='settings-list'>
                    <div className='settings-row'>
                        <h4>Member Since</h4>
                        <h4>{moment(userData.createdAt).format('LL')}</h4>
                    </div>
                    <div className='settings-row'>
                        <h4>Subscription</h4>
                        <h4>None</h4>
                        <button className='solid-btn-secondary'>Subscribe Now</button>
                    </div>
                </div>
                <br /><br /><br />
                <h3>General</h3>
                <br />
                <div className='settings-list'>
                    <div className='editable-settings-row' style={{display: editingEmail && 'none'}} onClick={() => setEditingEmail(true)}>
                        <h4>Email Address</h4>
                        <h4>{currentUser.email}</h4>
                    </div>
                    <div className='settings-edit-container' hidden={!editingEmail} style={{ marginBottom: editingEmail && 15}}>
                        <div className='settings-edit-header' onClick={() => setEditingEmail(false)}>
                            <h4>Email Address</h4>
                            <i className='bi bi-pencil' />
                        </div>
                        <br />
                        <div className='d-flex jc-space-between ai-center'>
                            <h4>Email Address</h4>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' style={{width: 300}}/>
                        </div>
                        <br /><br />
                        <div className='d-flex jc-flex-end' style={{gap: 20}}>
                            <button className='clear-btn-secondary' onClick={() => setEditingEmail(false)}>Cancel</button>
                            <button className='solid-btn-secondary'>Save</button>
                        </div>
                        <br />
                    </div>
                    <div className='settings-row'>
                        <h4>Password</h4>
                        <button className='clear-btn-secondary'>Reset Password</button>
                    </div>
                    <div className='settings-row'></div>
                    <div className='settings-row'>
                        <h4>Account deactivation</h4>
                        <button className='error-btn-secondary'>Delete your account</button>
                    </div>
                </div>
                <br />
            </div>
            }
        </div>
    )
}