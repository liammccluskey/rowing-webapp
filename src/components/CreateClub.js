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

export default function CreateClub() {
    const {currentUser} = useAuth()
    const {domainURL} = useTheme()
    const history = useHistory()

    const [name, setName] = useState('')
    const [customURL, setCustomURL] = useState('')
    const [description, setDescription] = useState('')

    const [tempIconURL, setTempIconURL] = useState()
    const [iconFile, setIconFile] = useState()
    const inputStyle = {
        width: '400px'
    }

    async function handleSubmit(e) {
        e.preventDefault()
        // Upload club image
        let iconURL
        try {
            await storage.ref('clubs').child(customURL).put(iconFile);
            iconURL = await storage.ref('clubs').child(customURL).getDownloadURL()
        } catch(error) {
            console.log('Error uploading image: \n' + error)
        }

        const clubData = {
            name: name,
            customURL: customURL,
            description: description,
            iconURL: iconURL,
            uid: currentUser.photoURL
        }

        try {
            await api.post('/clubs', clubData)
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

    function handleIconChange(e) {
        e.preventDefault()
        setIconFile(e.target.files[0])
    }

    useEffect( () => {
        if (!iconFile) {return}
        const imgURL = URL.createObjectURL(iconFile)
        setTempIconURL(imgURL)
    }, [iconFile])

    return (
        <div>
            <MainHeader />
            <SubHeader title='Create a Club' />
            <div className='main-container'>
                <form className='create-club' id='form-create-club' onSubmit={handleSubmit}>
                    <label style={{float: 'right'}} >
                        Club Icon <br />
                        <img 
                            src={tempIconURL ? tempIconURL : process.env.REACT_APP_DEFAULT_CLUB_ICON_URL}
                            height='150px' width='150px' 
                            style={{ borderRadius: '5px'}}
                        />
                        <input onChange={handleIconChange} type='file' accept='image/*' required 
                            style={{display: 'block'}}
                        />
                    </label>
                    <label>
                        Club Name <br />
                        <input style={inputStyle} type='text' value={name} onChange={e => setName(e.target.value)} required/>
                    </label>
                    <br /><br />
                    <label>
                        Description <br />
                        <textarea 
                            style={{width: '400px', resize: 'none'}} maxLength='200' value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            rows='5'
                        />
                    </label>
                    <br /><br />
                    <label>
                        Custom URL <br />
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
        
    )
}