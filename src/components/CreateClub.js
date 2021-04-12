import React, {useEffect, useState} from 'react'
import MainHeader from './headers/MainHeader'
import SubHeader from './headers/SubHeader'
import {useTheme} from '../contexts/ThemeContext'
import {storage} from '../firebase'
import {useAuth} from '../contexts/AuthContext'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

const srcBanner = 'https://styles.redditmedia.com/t5_2qljq/styles/bannerBackgroundImage_zfhrcn1w7u911.jpg?width=4000&format=pjpg&s=88d594d779756f76ef8a5e0073e1d2959cd501bf'

export default function CreateClub() {
    const {domainURL} = useTheme()
    const {thisUser} = useAuth()
    const history = useHistory()

    const [name, setName] = useState('')
    const [customURL, setCustomURL] = useState('')
    const [description, setDescription] = useState('')

    const [tempIconURL, setTempIconURL] = useState()
    const [iconFile, setIconFile] = useState()
    const [tempBannerURL, setTempBannerURL] = useState()
    const [bannerFile, setBannerFile] = useState()
    const inputStyle = {
        width: '400px'
    }

    async function handleSubmit(e) {
        e.preventDefault()
        // Upload club image
        let iconURL
        try {
            await storage.ref('clubicons').child(customURL).put(iconFile);
            iconURL = await storage.ref('clubicons').child(customURL).getDownloadURL()
        } catch(error) {
            console.log(error.message)
        }

        let bannerURL = undefined
        if (tempBannerURL) {
            try {
                await storage.ref('clubbanners').child(customURL).put(bannerFile);
                bannerURL = await storage.ref('clubbanners').child(customURL).getDownloadURL()
            } catch(error) {
                console.log(error)
            }
        }
        
        const clubData = {
            name: name,
            customURL: customURL,
            description: description,
            iconURL: iconURL,
            bannerURL: bannerURL
        }

        try {
            const res = await api.post('/clubs', clubData)
            await api.post('/clubmemberships', {user: thisUser._id, club: res.data._id, role: 2})
            history.push(`/clubs/${customURL}`)
        } catch (error) {
            console.log(error)
        }
    }

    function handleCustomURLChange(e) {
        const validRegex = new RegExp(/^([a-zA-Z0-9-]{0,20})$/)
        console.log()
        if (validRegex.test(e.target.value)) {
            setCustomURL(e.target.value)
        }
    }

    useEffect( () => {
        if (!iconFile) {return}
        const imgURL = URL.createObjectURL(iconFile)
        setTempIconURL(imgURL)
    }, [iconFile])

    useEffect(() => {
        if (!bannerFile) {return}
        setTempBannerURL(URL.createObjectURL(bannerFile))
    }, [bannerFile])

    return (
        <div>
            <MainHeader />
            <SubHeader title='Create a Club' />
            <br />
            <div className='main-container'>
                <div className='float-container' style={{padding: '20px 20px'}}>
                    <form className='create-club' id='form-create-club' onSubmit={handleSubmit}>
                        <label>
                            Club Name *<br />
                            <input style={inputStyle} type='text' value={name} onChange={e => setName(e.target.value)} required/>
                        </label>
                        <br /><br />
                        <label>
                            Club Banner <br />
                            <input onChange={e => setBannerFile(e.target.files[0])} type='file' accept='image/*'
                                style={{display: 'none'}}
                            />
                             <div className='banner-image-input'>
                                 <img src={tempBannerURL ? tempBannerURL : srcBanner} />
                                <i className='bi bi-upload' style={{position: 'absolute'}} />
                            </div>
                        </label>
                        <br />
                        <label >
                            Club Icon *<br />
                            <input onChange={e => setIconFile(e.target.files[0])} type='file' accept='image/*' required 
                                style={{display: 'none'}}
                            />
                            <div className='icon-image-input'>
                                {tempIconURL && <img src={tempIconURL ? tempIconURL : ''} /> }
                                <i className='bi bi-upload' style={{position: 'absolute'}} />
                            </div>
                        </label>
                        <br /><br />
                        <label>
                            Description *<br />
                            <textarea 
                                style={{width: '400px', resize: 'none'}} maxLength='200' value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                rows='5'
                            />
                        </label>
                        <br /><br />
                        <label>
                            Custom URL *<br />
                            {domainURL}
                            <input value={customURL} onChange={handleCustomURLChange} required/>
                        </label>
                        <br /><br />
                    </form>
                    <br />
                    <div className='d-flex jc-center ai-center'>
                        <button form='form-create-club' className='solid-btn' type='submit'>Create Club</button>
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}