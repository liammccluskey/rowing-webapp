import React, {useState} from 'react'
import SettingsHeader from './SettingsHeader'
import MainHeader from '../headers/MainHeader'
import {useAuth} from '../../contexts/AuthContext'

export default function Profile() {
    const {currentUser} = useAuth()


    const [displayName, setDisplayName] = useState(currentUser.displayName)

    const [editingItems, setEditingItems] = useState([])
    const profileItems = [
        {title: 'Current Photo', text: null, src: currentUser.photoURL},
        {title: 'Display Name', text: currentUser.displayName, src: null},
        {title: 'Birthday', text: null, src: null},
        {title: 'Gender', text: 'Male', src: null}
    ]

    function removeEditingItem(itemIndex) {
        setEditingItems(curr => curr.filter(e => e !== itemIndex))
    }

    function addEditingItem(itemIndex) {
        setEditingItems( curr => [...curr, itemIndex] )
    }

    function isEditing(itemIndex) {
        return editingItems.includes(itemIndex)
    }

    return (
        <div>
            <MainHeader />
            <SettingsHeader subPath='/profile' />
            <div className='main-container settings-page'>
                <br /><br />
                <h3>Edit Profile</h3>
                <br />
                <div className='setting-list'>
                    {profileItems.map((item, idx) => (
                        <div>
                            <div className='editable-settings-row' style={{display: isEditing(idx) && 'none'}}
                                onClick={() => addEditingItem(idx)}
                            >
                                <h4>{item.title}</h4>
                                {item.text !== null ? 
                                    <h4>{item.text}</h4> 
                                    :
                                    <img height={40} width={40} src={item.src} style={{borderRadius: '50%'}} />
                                }
                            </div>
                            <div className='settings-edit-container' hidden={!isEditing(idx)}
                                style={{marginBottom: isEditing(idx) && 15}}
                            >
                                <div className='settings-edit-header' onClick={() => removeEditingItem(idx)}>
                                    <h4>{item.title}</h4>
                                    <i className='bi bi-pencil' />
                                </div>
                                <br />
                                <div className='d-flex jc-space-between ai-center'>
                                    <h4>{item.title}</h4>
                                    <input />
                                </div>
                                <br /><br />
                                <div className='d-flex jc-flex-end ai-center' style={{gap: 20}}>
                                    <button className='clear-btn-secondary' onClick={() => removeEditingItem(idx)}>
                                        Cancel
                                    </button>
                                    <button className='solid-btn-secondary'>Save</button>
                                </div>
                            <br />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}