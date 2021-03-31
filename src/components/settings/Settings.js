
import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import Profile from './Profile'
import Preferences from './Preferences'
import {useAuth} from '../../contexts/AuthContext'
import {useTheme} from '../../contexts/ThemeContext'
import Loading from '../misc/Loading'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Settings() {
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

    const settingsGroups = [
        {title: 'Membership'},
        {title: 'Account'},
        {title: 'Profile'},
        {title: 'Preferences'}
    ]

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, boxShadow: 'none'}} />
            <SubHeader title='Settings' style={{position: 'sticky', top: 70}} />
            {loading ? <Loading /> :
            <div className='main-container settings-page d-flex jc-flex-start ai-flex-start' style={{zIndex: -1}}>
                <div className='settings-menu'>
                    {settingsGroups.map((group, idx) => (
                        <p key={idx} style={{marginBottom: 15}} className='menu-link'
                            onClick={() => {
                                const elemPos = document.getElementById(group.title).offsetTop
                                window.scrollTo({top: elemPos - 170})
                            }}
                        >
                            {group.title}
                        </p>
                    ))}
                </div>
                <div style={{width: 650, maxWidth: 650, minWidth: 650, marginLeft: 200}}>
                    <h3 id='Membership'>Membership</h3>
                    <br />
                    <div className='settings-list'>
                        <div className='settings-row'>
                            <p>Member Since</p>
                            <p>{moment(userData.createdAt).format('LL')}</p>
                        </div>
                        <div className='settings-row'>
                            <p>Subscription</p>
                            <p>None</p>
                            <button className='solid-btn-secondary'>Subscribe Now</button>
                        </div>
                    </div>
                    <h3 id='Account'>Account</h3>
                    <br />
                    <div className='settings-list'>
                        <div className='editable-settings-row' style={{display: editingEmail && 'none'}} onClick={() => setEditingEmail(true)}>
                            <p>Email Address</p>
                            <p>{currentUser.email}</p>
                        </div>
                        <div className='settings-edit-container' hidden={!editingEmail} style={{ marginBottom: editingEmail && 15}}>
                            <div className='settings-edit-header' onClick={() => setEditingEmail(false)}>
                                <p>Email Address</p>
                                <i className='bi bi-pencil' />
                            </div>
                            <br />
                            <div className='d-flex jc-space-between ai-center'>
                                <p>Email Address</p>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' style={{width: 300}}/>
                            </div>
                            <br /><br />
                            <div className='d-flex jc-flex-end' style={{gap: 20}}>
                                <button className='clear-btn-secondary bc-trans' onClick={() => setEditingEmail(false)}>Cancel</button>
                                <button className='solid-btn-secondary bc-trans'>Save</button>
                            </div>
                            <br />
                        </div>
                        <div className='settings-row'>
                            <p>Password</p>
                            <button className='clear-btn-secondary'>Reset Password</button>
                        </div>
                        <div className='settings-row'>
                            <p />
                            <button className='error-btn-secondary'>Delete your account</button>
                        </div>
                    </div>
                    <Profile />
                    <Preferences />
                    <div style={{height: 500}} />
                </div>
            </div>
            }
        </div>
    )
}