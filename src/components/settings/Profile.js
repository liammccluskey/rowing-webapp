
import React, {useState, useEffect} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import {storage} from '../../firebase'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Profile() {
    const {currentUser} = useAuth()
    const {setMessage} = useMessage()

    const [profileDisplayName, setProfileDisplayName] = useState(currentUser.displayName)
    const [displayName, setDisplayName] = useState(currentUser.displayName)
    const [isEditingName, setIsEditingName] = useState(false)

    const [profilePhotoURL, setProfilePhotoURL] = useState(currentUser.photoURL)
    const [photoURL, setPhotoURL] = useState()
    const [photoFile, setPhotoFile] = useState()
    const [isEditingPhoto, setIsEditingPhoto] = useState(false)

    useEffect( () => {
        if (!photoFile) {return}
        setPhotoURL(URL.createObjectURL(photoFile))
    }, [photoFile])

    async function handleSubmitName(e) {
        e.preventDefault()
        try {
            await currentUser.updateProfile({
                displayName: displayName
            })
            setProfileDisplayName(displayName)
            setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        } catch (error) {
            console.log(error)
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
        setIsEditingName(false)
    }

    async function handleSubmitImage(e) {
        e.preventDefault()
        async function patchIconURL(iconURL) {
            try {
                await api.patch(`/users/${currentUser.uid}/iconURL`, {iconURL: iconURL})
            } catch (error) {
                setMessage({title: error.message, isError: true, timestamp: moment()})
            }
        } 
        try {
            await storage.ref('users').child(currentUser.uid).put(photoFile);
            const resURL = await storage.ref('users').child(currentUser.uid).getDownloadURL()
            await currentUser.updateProfile({
                photoURL: resURL
            })
            await patchIconURL(resURL)
            setProfilePhotoURL(resURL)
            setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        } catch(error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
        setIsEditingPhoto(false)
    }

    return (
        <div>
            <h3 id='Profile'>Profile</h3>
            <br />
            <div className='settings-list'>
                <div className='editable-settings-row' style={{display: isEditingName && 'none'}}
                    onClick={() => setIsEditingName(true)}
                >
                    <p>Display Name</p>
                    <p>{currentUser.displayName}</p>
                </div>
                <div className='settings-edit-container' hidden={!isEditingName} style={{marginBottom: isEditingName && 15}}>
                    <div className='settings-edit-header' onClick={() => setIsEditingName(false)}>
                        <p>Display Name</p>
                        <i className='bi bi-pencil' />
                    </div>
                    <br />
                    <form onSubmit={handleSubmitName}> 
                        <div className='d-flex jc-space-between ai-center'>
                            <p>Display Name</p>
                            <input type='text' value={displayName} onChange={e => setDisplayName(e.target.value)} required/>
                        </div>
                        <br /><br />
                        <div className='d-flex jc-flex-end' style={{gap: 20}}>
                            <button type='button' className='clear-btn-secondary' onClick={() => setIsEditingName(false)}>Cancel</button>
                            <button type='submit' className='solid-btn-secondary'>Save</button>
                        </div>
                    </form>
                    <br />
                </div>

                <div className='editable-settings-row' style={{display: isEditingPhoto && 'none'}}
                    onClick={() => setIsEditingPhoto(true)}
                >
                    <p>Current Photo</p>
                    <img height={40} width={40} style={{borderRadius: '50%'}} src={profilePhotoURL}/>
                </div>
                <div className='settings-edit-container' hidden={!isEditingPhoto} style={{marginBottom: isEditingPhoto && 15}}>
                    <div className='settings-edit-header' onClick={() => setIsEditingPhoto(false)}>
                        <p>Current Photo</p>
                        <i className='bi bi-pencil' />
                    </div>
                    <br />
                    <form onSubmit={handleSubmitImage}>
                        <div className='d-flex jc-space-between ai-center'>
                            <p>Current Photo</p>
                            <input type='file' accept='image/*' onChange={e => setPhotoFile(e.target.files[0])} required/>
                        </div>
                        <br /><br />
                        <div className='d-flex jc-flex-end' style={{gap: 20}}>
                            <button type='button' className='clear-btn-secondary' onClick={() => setIsEditingPhoto(false)}>Cancel</button>
                            <button type='submit' className='solid-btn-secondary'>Save</button>
                        </div>
                    </form>
                    <br />
                </div>

            </div>
        </div>
    )
}
