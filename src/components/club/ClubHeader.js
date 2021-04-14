import React, {useEffect, useState} from 'react'
import SubHeader from '../headers/SubHeader'
import {useParams, useHistory} from 'react-router-dom'
import {useMessage} from '../../contexts/MessageContext'
import {useAuth} from '../../contexts/AuthContext'
import moment from 'moment'
import axios from 'axios'
import Confirmation from '../misc/Confirmation'

const srcBanner = 'https://styles.redditmedia.com/t5_2qljq/styles/bannerBackgroundImage_zfhrcn1w7u911.jpg?width=4000&format=pjpg&s=88d594d779756f76ef8a5e0073e1d2959cd501bf'
const src ='https://miro.medium.com/max/3600/1*i-PXQ3H7ork5fLqr2dQw6g.png'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function ClubHeader(props) {
    const {currentUser, thisUser} = useAuth()
    const history = useHistory()
    const {setMessage} = useMessage()

    const [club, setClub] = useState(props.club)
    const [membership, setMembership] = useState(props.membership)
    const [isMember, setIsMember] = useState()

    const [confirmationHidden, setConfirmationHidden] = useState(true)

    const items = [
        {title: 'General', path: '/general'},
        {title: 'Members', path: '/members'}
    ]

    useEffect(() => {
        setClub(props.club)
        setMembership(props.membership)
    }, [props])

    async function handleClickJoin() {
        async function joinClub() {
            try {
                await api.post(`/clubmemberships`, {club: club._id, user: thisUser._id, role: 0})
                setMessage({title: `Successfully joined  "${club.name}"`, isError: false, timestamp: moment() })
            } catch(error) {
                setMessage({title: `Error joining "${club.name}". ${error.message}`, isError: true, timestamp: moment() })
                console.log(error)
            }
        }
        await joinClub()
        props.fetchData()
    }

    async function handleClickConfirmLeave() {
        async function leaveClub() {
            try {
                const url = `/clubmemberships?club=${club._id}&user=${thisUser._id}`
                console.log(url)
                await api.delete(url)
                setMessage({title: `Successfully left  "${club.name}"`, isError: false, timestamp: moment() })
            } catch(error) {
                setMessage({title: `Error leaving "${club.name}". ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        await leaveClub()
        props.fetchData()

    }

    return (
        <div style={{position: 'sticky', top: 0}}>
            <Confirmation title='Confirm' message='Are you sure you want to leave this club?' 
                handleClickConfirm={handleClickConfirmLeave} hidden={confirmationHidden} setHidden={setConfirmationHidden}
            />
            <img className='banner-image' src={club.bannerURL ? club.bannerURL : srcBanner} />
            <SubHeader
                title={props.title} 
                items={items} 
                path={`/clubs/${club.customURL}`}
                subPath={props.subPath}
                iconURL={props.club.iconURL}
            >
                {membership.isMember ? 
                    <button className='clear-btn-secondary' onClick={() => setConfirmationHidden(false)}>Leave</button>
                    :
                    <button className='solid-btn-secondary' onClick={handleClickJoin}>Join</button>
                }
            </SubHeader>
        </div>
    )
}