import React, {useEffect, useState} from 'react'
import SubHeader from '../headers/SubHeader'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import Confirmation from '../misc/Confirmation'
import axios from 'axios'
import moment from 'moment'

const src ='https://miro.medium.com/max/3600/1*i-PXQ3H7ork5fLqr2dQw6g.png'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function AthleteHeader(props) {
    const {currentUser} = useAuth()
    const {setMessage} = useMessage()

    const [user, setUser] = useState(props.user)
    const [follows, setFollows] = useState()
    const [doesFollow, setDoesFollow] = useState()
    const [loading, setLoading] = useState(true)

    const [confirmationHidden, setConfirmationHidden] = useState(true)
    
    const items = [
        {title: 'Overview', path: '/'}
    ]

    useEffect(() => {
        setUser(props.user)
        fetchData()
    }, [props.user]) 

    async function fetchData() {
        await fetchFollowSummary()
        await fetchDoesFollow()
        setLoading(false)
    }

    async function fetchFollowSummary() {
        try {
            const res = await api.get(`/follows/uid/${user.uid}/summary`)
            setFollows(res.data)
        } catch (error) {console.log(error)}
    }

    async function fetchDoesFollow() {
        try {
            const res = await api.get(`/follows/uid/${currentUser.uid}/doesfollow/uid/${user.uid}`)
            setDoesFollow(res.data.doesFollow)
        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleClickFollow() {
        try {
            await api.post('/follows', {follower: currentUser.uid, followee: user.uid})
            setMessage({title: `You are now following ${user.displayName}`, isError: false, timestamp: moment()})
        } catch (error) {
            setMessage({title: `Error following ${user.displayName}. ${error.message}`, isError: true, timestamp: moment()})
        }
        fetchData()
    }

    async function handleClickUnfollow() {
        try {
            await api.delete(`/follows?follower=${currentUser.uid}&followee=${user.uid}`)
            setMessage({title: `You unfollowed ${user.displayName}`, isError: false, timestamp: moment()})
        } catch (error) {
            setMessage({title: `Error unfollowing ${user.displayName}. ${error.message}`, isError: true, timestamp: moment()})
        }
        fetchData()
    }

    return (
        <div style={{position: 'sticky', top: 0}}>
            <img className='banner-image' src={src} />
            <SubHeader 
                title={user.displayName}
                iconURL={user.iconURL}
                path={`/athletes/${user.uid}`}
                subPath={props.subPath}
                items={items}
            >
                {!loading &&
                    <div className='d-flex jc-center ai-center' style={{marginRight: 40}}>
                        <h3 style={{marginRight: 20}}>
                            {follows.followees.toLocaleString()} 
                            <h6>Following</h6>
                        </h3>
                        <h3>
                            {follows.followers.toLocaleString()}
                            <h6>Followers</h6>
                        </h3>
                    </div>
                }
                {(!loading && user.uid !== currentUser.uid) && 
                    (doesFollow ? 
                        <button className='clear-btn-secondary' onClick={() => setConfirmationHidden(false)}>Unfollow</button>
                        :
                        <button className='solid-btn-secondary' onClick={handleClickFollow}>Follow</button>
                    )
                }
            </SubHeader>
            <Confirmation title='Confirm' message={`Are you sure you want to unfollow ${user.displayName}?`}
                handleClickConfirm={handleClickUnfollow} hidden={confirmationHidden} setHidden={setConfirmationHidden}
            />
        </div>
    )
} 