
import React, {useState, useEffect} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import {storage} from '../../firebase'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})


const src ='https://miro.medium.com/max/3600/1*i-PXQ3H7ork5fLqr2dQw6g.png'

export default function Profile() {
    const {currentUser, thisUser, fetchThisUser} = useAuth()
    const {setMessage} = useMessage()

    const [profileDisplayName, setProfileDisplayName] = useState(currentUser.displayName)
    const [displayName, setDisplayName] = useState(currentUser.displayName)
    const [isEditingName, setIsEditingName] = useState(false)

    const [profilePhotoURL, setProfilePhotoURL] = useState(currentUser.photoURL)
    const [photoFile, setPhotoFile] = useState()
    const [isEditingPhoto, setIsEditingPhoto] = useState(false)

    const [profileBannerURL, setProfileBannerURL] = useState(thisUser.bannerURL ? thisUser.bannerURL : src)
    const [bannerFile, setBannerFile] = useState()
    const [isEditingBanner, setIsEditingBanner] = useState(false)


    async function handleSubmitName(e) {
        e.preventDefault()
        try {
            const update = { displayName: displayName }
            await currentUser.updateProfile(update)
            await api.patch(`/users/${thisUser._id}/displayName`, update)

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
        try {
            await storage.ref('usericons').child(thisUser._id).put(photoFile);
            const resURL = await storage.ref('usericons').child(thisUser._id).getDownloadURL()
            await currentUser.updateProfile({
                photoURL: resURL
            })
            await api.patch(`/users/${thisUser._id}/iconURL`, {iconURL: resURL})
            setProfilePhotoURL(resURL)
            setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        } catch(error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
        setIsEditingPhoto(false)
    }

    async function handleSubmitBanner(e) {
        e.preventDefault() 
        try {
            await storage.ref('userbanners').child(thisUser._id).put(bannerFile);
            const resURL = await storage.ref('userbanners').child(thisUser._id).getDownloadURL()
            await api.patch(`/users/${thisUser._id}/bannerURL`, {bannerURL: resURL})
            setProfileBannerURL(resURL)
            setMessage({title: 'Changes saved', isError: false, timestamp: moment()})
        } catch(error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
        setIsEditingBanner(false)
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
                    <p>{profileDisplayName}</p>
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
                    <img className='user-icon' src={profilePhotoURL}/>
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

                <div className='editable-settings-row' style={{display: isEditingBanner && 'none'}}
                    onClick={() => setIsEditingBanner(true)}
                >
                    <p>Current Banner Photo</p>
                    <img className='banner-image' src={profileBannerURL} style={{width: 200, height: 50}} />
                </div>
                <div className='settings-edit-container' hidden={!isEditingBanner} style={{marginBottom: isEditingBanner && 15}}>
                    <div className='settings-edit-header' onClick={() => setIsEditingBanner(false)}>
                        <p>Current Banner Photo</p>
                        <i className='bi bi-pencil' />
                    </div>
                    <br />
                    <form onSubmit={handleSubmitBanner}>
                        <div className='d-flex jc-space-between ai-center'>
                            <p>Current Banner Photo</p>
                            <input type='file' accept='image/*' onChange={e => setBannerFile(e.target.files[0])} required/>
                        </div>
                        <br /><br />
                        <div className='d-flex jc-flex-end' style={{gap: 20}}>
                            <button type='button' className='clear-btn-secondary' onClick={() => setIsEditingBanner(false)}>Cancel</button>
                            <button type='submit' className='solid-btn-secondary'>Save</button>
                        </div>
                    </form>
                    <br />
                </div>

            </div>
        </div>
    )
}
