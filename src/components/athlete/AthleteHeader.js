import React, {useEffect, useState} from 'react'
import SubHeader from '../headers/SubHeader'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import {useHistory, useParams} from 'react-router-dom'
import Confirmation from '../misc/Confirmation'
import axios from 'axios'
import moment from 'moment'

const src ='https://miro.medium.com/max/3600/1*i-PXQ3H7ork5fLqr2dQw6g.png'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function AthleteHeader(props) {
    const {thisUser} = useAuth()
    const {userID} = useParams()
    const {setMessage} = useMessage()
    const history = useHistory()

    const [user, setUser] = useState(props.user)
    const [followSummary, setFollowSummary] = useState()
    const [loadingSummary, setLoadingSummary] = useState(true)
    const [doesFollow, setDoesFollow] = useState()
    const [loadingDoesFollow, setLoadingDoesFollow] = useState(true)

    const [confirmationHidden, setConfirmationHidden] = useState(true)
    
    const items = [
        {title: 'Overview', path: '/'},
        {title: 'Following', path: '/following'}
    ]

    useEffect(() => {
        setUser(props.user)
        fetchData()
    }, [props.user]) 

    function fetchData() {
        fetchFollowSummary()
        fetchDoesFollow()
    }

    async function fetchFollowSummary() {
        try {
            const res = await api.get(`/follows/user/${userID}/summary`)
            setFollowSummary(res.data)
        } catch (error) {console.log(error)}
        setLoadingSummary(false)
    }

    async function fetchDoesFollow() {
        try {
            const res = await api.get(`/follows/doesfollow?follower=${thisUser._id}&followee=${userID}`)
            setDoesFollow(res.data.doesFollow)
        } catch (error) {
            console.log(error.message)
        }
        setLoadingDoesFollow(false)
    }

    async function handleClickFollow() {
        try {
            await api.post('/follows', {follower: thisUser._id, followee: userID})
            setMessage({title: `You are now following ${user.displayName}`, isError: false, timestamp: moment()})
        } catch (error) {
            setMessage({title: `Error following ${user.displayName}. ${error.message}`, isError: true, timestamp: moment()})
        }
        fetchData()
        {props.fetchData && props.fetchData()}
    }

    async function handleClickConfirmUnfollow() {
        async function unfollow() {
            try {
                await api.delete(`/follows?follower=${thisUser._id}&followee=${userID}`)
                setMessage({title: `You unfollowed ${user.displayName}`, isError: false, timestamp: moment()})
            } catch (error) {
                setMessage({title: `Error unfollowing ${user.displayName}. ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        await unfollow()
        fetchData()
        {props.fetchData && props.fetchData()}
    }

    function routeToFollowing() {
        if (props.subPath === '/following') { return }
        history.push(`/athletes/${userID}/following`)
    }

    return (
        <div style={{position: 'sticky', top: 0}}>
            <img className='banner-image' src={src} />
            <SubHeader 
                title={user.displayName}
                iconURL={user.iconURL}
                path={`/athletes/${userID}`}
                subPath={props.subPath}
                items={items}
            >
                {!loadingSummary &&
                    <div className='d-flex jc-center ai-center' style={{marginRight: 40}}>
                        <div style={{marginRight: 20, textAlign: 'center'}}>
                            <h3>{followSummary.followees.toLocaleString()}</h3>
                            <h5 className='page-link c-cs' onClick={routeToFollowing}>Following</h5>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <h3>{followSummary.followers.toLocaleString()}</h3>
                            <h5 className='page-link c-cs' onClick={routeToFollowing}>Followers</h5>
                        </div>
                    </div>
                }
                {(!loadingDoesFollow && userID !== thisUser._id) && 
                    (doesFollow ? 
                        <button className='clear-btn-secondary' onClick={() => setConfirmationHidden(false)}>Unfollow</button>
                        :
                        <button className='solid-btn-secondary' onClick={handleClickFollow}>Follow</button>
                    )
                }
            </SubHeader>
            <Confirmation title='Confirm' message={`Are you sure you want to unfollow ${user.displayName}?`}
                handleClickConfirm={handleClickConfirmUnfollow} hidden={confirmationHidden} setHidden={setConfirmationHidden}
            />
        </div>
    )
} 