import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {formatNumber} from '../../scripts/Numbers'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function SocialInfoCard(props) {
    const history = useHistory()
    const {thisUser} = useAuth()

    const [followSummary, setFollowSummary] = useState()
    const [loadingSummary, setLoadingSummary] = useState(true)

    useEffect(() => {
        fetchFollowSummary()
    }, [])

    async function fetchFollowSummary() {
        try {
            const res = await api.get(`/follows/user/${thisUser._id}/summary`)
            setFollowSummary(res.data)
        } catch (error) {console.log(error)}
        setLoadingSummary(false)
    }

    function routeToFollowing() {
        if (props.subPath === '/following') { return }
        history.push(`/athletes/${thisUser._id}/following`)
    }

    return (
        <div style={{...props.style, padding: '20px 20px'}} className='float-container bs-bb' >
            <h3>Social Stats</h3>
            <br />
            {!loadingSummary &&
                    <div className='d-flex jc-space-around ai-center'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>{formatNumber(followSummary.followees)}</h3>
                            <h5 className='page-link c-cs' onClick={routeToFollowing}>Following</h5>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <h3>{formatNumber(followSummary.followers)}</h3>
                            <h5 className='page-link c-cs' onClick={routeToFollowing}>Followers</h5>
                        </div>
                    </div>
                }
            <br />
            <div className='d-flex jc-center'>
                <button className='clear-btn-secondary' style={{flex: 1}} onClick={() => history.push('/explore/athletes')}>
                    Find Friends
                </button>
            </div>
        </div>
    )
}