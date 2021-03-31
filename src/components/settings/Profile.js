
import React, {useState} from 'react'
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
            <h3 id='Profile'>Profile</h3>
            <br />
            <div className='settings-list'>
                {profileItems.map((item, idx) => (
                    <div>
                        <div className='editable-settings-row' style={{display: isEditing(idx) && 'none'}}
                            onClick={() => addEditingItem(idx)}
                        >
                            <p>{item.title}</p>
                            {item.text !== null ? 
                                <p>{item.text}</p> 
                                :
                                <img height={40} width={40} src={item.src} style={{borderRadius: '50%'}} />
                            }
                        </div>
                        <div className='settings-edit-container' hidden={!isEditing(idx)}
                            style={{marginBottom: isEditing(idx) && 15}}
                        >
                            <div className='settings-edit-header' onClick={() => removeEditingItem(idx)}>
                                <p>{item.title}</p>
                                <i className='bi bi-pencil' />
                            </div>
                            <br />
                            <div className='d-flex jc-space-between ai-center'>
                                <p>{item.title}</p>
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
    )
}
