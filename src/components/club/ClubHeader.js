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
    const {currentUser} = useAuth()
    const history = useHistory()
    const {setMessage} = useMessage()

    const [club, setClub] = useState(props.club)
    const [isMember, setIsMember] = useState()

    const [confirmationHidden, setConfirmationHidden] = useState(true)

    const items = [
        {title: 'General', path: '/general'},
        {title: 'Members', path: '/members'}
    ]

    useEffect(() => {
        setClub(props.club)
        setIsMember(props.club.memberUIDs.includes(currentUser.uid))
    }, [props.club])

    async function handleClickJoin() {
        // send patch request to join club
        async function joinClub() {
            try {
                await api.patch(`/clubs/${club._id}/join`, {uid: currentUser.uid})
                setMessage({title: `Successfully joined  "${club.name}"`, isError: false, timestamp: moment() })
            } catch(error) {
                setMessage({title: `Error joining "${club.name}". ${error.message}`, isError: true, timestamp: moment() })
            }
        }
        await joinClub()
        props.fetchData()
    }

    async function handleClickConfirmLeave() {
        async function leaveClub() {
            try {
                await api.patch(`/clubs/${club._id}/leave`, {uid: currentUser.uid})
                setMessage({title: `Successfully left  "${club.name}"`, isError: false, timestamp: moment() })
            } catch(error) {
                setMessage({title: `Error leaving "${club.name}". ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        await leaveClub()
        setConfirmationHidden(true)
        props.fetchData()

    }

    return (
        <div style={{position: 'sticky', top: 0}}>
            <Confirmation title='Confirm' message='Are you sure you wish to leave this club?' 
                handleClickConfirm={handleClickConfirmLeave} hidden={confirmationHidden} setHidden={setConfirmationHidden}
            />
            <img className='banner-image' src={srcBanner} />
            <SubHeader
                title={props.title} 
                items={items} 
                path={`/clubs/${club.customURL}`}
                subPath={props.subPath}
            >
                {isMember ? 
                    <button className='clear-btn-secondary' onClick={() => setConfirmationHidden(false)}>Leave</button>
                    :
                    <button className='solid-btn-secondary' onClick={handleClickJoin}>Join</button>
                }
            </SubHeader>
        </div>
    )
}