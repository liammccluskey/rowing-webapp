import React, {useEffect, useState} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import {useMessage} from '../../contexts/MessageContext'
import {useTheme} from '../../contexts/ThemeContext'
import {storage} from '../../firebase'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import moment from 'moment'
import Loading from '../misc/Loading'
import {useHistory, useParams} from 'react-router-dom'
import Confirmation from '../misc/Confirmation'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

const srcBannerDefault = 'https://styles.redditmedia.com/t5_2qljq/styles/bannerBackgroundImage_zfhrcn1w7u911.jpg?width=4000&format=pjpg&s=88d594d779756f76ef8a5e0073e1d2959cd501bf'

export default function EditClub() {
    const {setMessage} = useMessage()
    const {thisUser} = useAuth()
    const {clubURL} = useParams()
    const history = useHistory()

    const [club, setClub] = useState()
    const [myMembership, setMyMembership] = useState()
    const [loading, setLoading] = useState(true)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const [iconURL, setIconURL] = useState()
    const [bannerURL, setBannerURL] = useState() 

    const [hasModifications, setHasModifications] = useState(false)
    const [nameModified, setNameModified] = useState(false)
    const [descriptionModified, setDescriptionModified] = useState(false)
    const [isPrivateModified, setIsPrivateModified] = useState(false)
    const [iconURLModified, setIconURLModified] = useState(false)
    const [bannerURLModified, setBannerURLModified] = useState(false)

    const [bannerFile, setBannerFile] = useState()
    const [iconFile, setIconFile] = useState()

    const inputStyle = {
        width: '400px'
    }

    const colorYellow = 'var(--color-yellow-text)'

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/clubs/customURL/${clubURL}`)
                setClub(res.data)
                const result = await api.get(`/clubmemberships/ismember?user=${thisUser._id}&club=${res.data._id}`)
                setMyMembership(result.data)

                if (result.data.role < 1 || !result.data.isMember) {
                    setMessage({title: 'You do not have permission to edit this club', isError: true, timestamp: moment()})
                    history.push('/dashboard')
                    return
                }
            } catch(error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        restoreCurrentClubInformation()
    }, [club])

    useEffect(() => {
        if (loading) {return}
        setNameModified(name !== club.name)
        setDescriptionModified(description !== club.description)
        setIsPrivateModified(isPrivate !== club.isPrivate)
        setIconURLModified(iconURL !== club.iconURL)
        setBannerURLModified(bannerURL!==club.bannerURL)
    }, [name, description, isPrivate, iconURL, bannerURL])

    useEffect(() => {
        if (loading) {return}
        setHasModifications(
            nameModified || descriptionModified || isPrivateModified || iconURLModified || bannerURLModified
        )
    }, [nameModified, descriptionModified, isPrivateModified, iconURLModified, bannerURLModified])

    function restoreCurrentClubInformation() {
        if (!club) {return}
        setName(club.name)
        setDescription(club.description)
        setIsPrivate(club.isPrivate)
        setBannerURL(club.bannerURL)
        setIconURL(club.iconURL)

        setIconFile(null)
        setBannerFile(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let modifiedClub = {}
        if (iconURLModified) {
            try {
                await storage.ref('clubicons').child(clubURL).put(iconFile);
                let newIconURL = await storage.ref('clubicons').child(clubURL).getDownloadURL()
                modifiedClub.iconURL = newIconURL
            } catch(error) { console.log(error.message) }
        }
        
        if (bannerURLModified) {
            try {
                await storage.ref('clubbanners').child(clubURL).put(bannerFile);
                let newBannerURL = await storage.ref('clubbanners').child(clubURL).getDownloadURL()
                modifiedClub.bannerURL = newBannerURL
            } catch(error) { console.log(error) }
        }

        if (nameModified) {modifiedClub.name = name}
        if (descriptionModified) {modifiedClub.description = description}
        if (isPrivateModified) {modifiedClub.isPrivate = isPrivate}

        try {
            const res = await api.patch(`/clubs?club=${club._id}&requestingUser=${thisUser._id}`, modifiedClub)
            setMessage({title: 'Club changes saved', isError: false, timestamp: moment()})
            history.push(`/clubs/${clubURL}/general`)
        } catch (error) {
            setMessage({title: `Error saving changes. ${error.response.data.message}`, isError: true, timestamp: moment()})
        }
    }

    function handleClickCancel() {
        restoreCurrentClubInformation()
        setMessage({title: 'Restored current club information', isError: false, timestamp: moment()})
    }

    function handleClickUseDefaultBanner() {
        setBannerURL(srcBannerDefault)
        setBannerFile(null)
        setMessage({title: 'Set default banner', isError: false, timestamp: moment()})
    }

    useEffect( () => {
        if (!iconFile) {return}
        setIconURL(URL.createObjectURL(iconFile))
    }, [iconFile])

    useEffect(() => {
        if (!bannerFile) {return}
        setBannerURL(URL.createObjectURL(bannerFile))
    }, [bannerFile])

    return (
        <div>
            <MainHeader />
            <SubHeader title='Edit Club' />
            <br /><br />
            {loading ? <Loading /> : (!loading && !club) ? <h4>We couldn't find a club at that link</h4> :
            <div className='main-container' style={{marginBottom: 100}}>
                <div className='float-container'>
                    <div className='d-flex jc-space-between ai-center'
                        style={{
                            backgroundColor: 'var(--color-translucent-yellow)', 
                            padding: hasModifications ? 15 : 0, display: !hasModifications && 'none'}}  
                    >
                        <h4 style={{color:colorYellow}}>
                            Club Information Modified
                        </h4>
                        <div>
                            <button className='clear-btn-cancel mr-10' style={{color: colorYellow}} onClick={handleClickCancel}>
                                Cancel
                            </button>
                            <button className='clear-btn-secondary' style={{color: colorYellow, borderColor: colorYellow}}
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                    <form className='create-club' onSubmit={handleSubmit} style={{padding: '30px 30px'}} id='edit-club'>
                        <label>
                            Club Name 
                            <h6 className='modified-label' style={{display: !nameModified && 'none'}}>Modified</h6>
                            <br />
                            <input style={inputStyle} type='text' value={name} onChange={e => setName(e.target.value)}/>
                        </label>
                        <br /><br />
                        <label>
                            Club Banner 
                            <h6 className='modified-label' style={{display: !bannerURLModified && 'none'}}>
                                Modified
                            </h6>
                            <br />
                            <input onChange={e => setBannerFile(e.target.files[0])} type='file' accept='image/*'
                                style={{display: 'none'}}
                            />
                             <div className='banner-image-input'>
                                 <img src={bannerURL ? bannerURL : srcBannerDefault} />
                                <i className='bi bi-upload' style={{position: 'absolute'}} />
                            </div>
                        </label>
                        <button className='clear-btn-secondary' style={{float: 'right', marginTop: 5}} type='button'
                            onClick={handleClickUseDefaultBanner} 
                        >
                            Use default banner
                        </button>
                        <br /><br />
                        <label >
                            Club Icon
                            <h6 className='modified-label' style={{display: !iconURLModified && 'none'}}>
                                Modified
                            </h6>
                            <br />
                            <input onChange={e => setIconFile(e.target.files[0])} type='file' accept='image/*' 
                                style={{display: 'none'}}
                            />
                            <div className='icon-image-input'>
                                <img src={iconURL} />
                                <i className='bi bi-upload' style={{position: 'absolute'}} />
                            </div>
                        </label>
                        <br /><br />
                        <label>
                            Description
                            <h6 className='modified-label' style={{display: !descriptionModified && 'none'}}>
                                Modified
                            </h6>
                            <br />
                            <textarea 
                                style={{width: '400px', resize: 'none'}} maxLength='200' value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                rows='5'
                            />
                        </label>
                        <br /><br />
                        <label>
                            Privacy 
                            <h6 className='modified-label' style={{display: !isPrivateModified && 'none'}}>
                                Modified
                            </h6>
                            <br />
                            <input type='checkbox' checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} className='mr-10'/>
                            <p className='d-inline mr-5'>Make your club invite only</p>
                            <i className={`bi bi-${isPrivate ? 'lock' : 'unlock'}-fill c-cs`} style={{fontSize: 20}}/>
                        </label>
                    </form>
                </div>
                
            </div>
            }
        </div>
        
    )
}