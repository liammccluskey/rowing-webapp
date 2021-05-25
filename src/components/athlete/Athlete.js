
import React, { useState, useEffect } from 'react'
import {useParams, useHistory} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MainHeader from '../headers/MainHeader'
import AthleteHeader from './AthleteHeader'
import ActivityCard from '../feed/ActivityCard'
import FeedLoader from '../feed/FeedLoader'
import Pending from '../misc/Pending'
import axios from 'axios'
import moment from 'moment'
import {formatUnit} from '../../scripts/Numbers'

import ClubIcon from '../icons/ClubIcon'
import YearHeatmap from '../charts/YearHeatmap'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Athlete() {
    const { thisUser } = useAuth()
    const {userID} = useParams()
    const history = useHistory()

    const [user, setUser] = useState()
    const [loadingUser, setLoadingUser] = useState(true)

    const [clubs, setClubs] = useState([])
    const [loadingClubs, setLoadingClubs] = useState(true)

    const [canLoadMoreActivities, setCanLoadMoreActivities] = useState(false)
    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(true)

    const [heatmapData, setHeatmapData] = useState({})
    const [loadingHeatmap, setLoadingHeatmap] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            setLoadingUser(true)
            try {
                const res = await api.get(`/users/${userID}`)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
            setLoadingUser(false)
        }
        async function fetchClubs() {
            const url = `/clubmemberships/user/${userID}`
            const res = await api.get(url)
            setClubs(res.data)
            setLoadingClubs(false)
        }
        async function fetchHeatmapData() {
            try {
                const url = `/users/${userID}/activity-heatmap?currentYear=${moment().year()}&yearOffset=0`
                const res = await api.get(url)
                setHeatmapData(res.data) 
            } catch(error) {
                console.log(error.response.data.message)
            }
            setLoadingHeatmap(false)
        }
        fetchUser()
        fetchActivities()
        fetchClubs()
        fetchHeatmapData()
    }, [userID])

    async function fetchActivities() {
        setLoadingActivities(true)
        const pageSize = 5
        const currentPage = Math.ceil(activities.length / pageSize)
        try {
            const url = `/feed/athlete-profile?user=${userID}&page=${currentPage + 1}&pagesize=${pageSize}`
            const res = await api.get(url)
            setActivities(curr => [...curr, ...res.data])
            setCanLoadMoreActivities(res.data.length >= pageSize)
        } catch (error) {
            console.log(error.response.data.message)
        }
        setLoadingActivities(false)
    }

    function handleClickLoadMoreActivities() {
        if (loadingActivities || !canLoadMoreActivities) {return}
        fetchActivities()
    }
    

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, zIndex: 100}} />
            {(!loadingUser && !user) && <h2 style={{paddingTop: 40}}>We couldn't find an athlete at that link</h2>}
            {(!loadingUser && user) &&
            <div>
                <AthleteHeader user={user} subPath='/' />
                <br /><br />
                
                            
                <div className='main-container' style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 50}}>
                    <div style={{gridColumn: '1/3'}}>
                        <h3>Activities in {moment().year()}</h3>
                        <br />
                        <div className='float-container' style={{padding: 20, overflow: 'scroll'}}>
                            { (!loadingHeatmap) &&
                                <h5 className='mb-10'> {userID === thisUser._id ? 'You have' : user.displayName + ' has'} 
                                {' '} completed {' '}
                                {heatmapData.count} {formatUnit('activity', heatmapData.count)} this year
                                </h5>
                            }
                            <YearHeatmap data={heatmapData} dataUnit='activity'/>
                        </div>
                    </div>
                    <div>
                        <h3>Recent Activities</h3>
                        <br />
                        {activities.map((ac, idx) => 
                            <div key={idx}>
                                <ActivityCard activity={ac} />
                            </div>
                        )}
                        <FeedLoader 
                            pluralUnit='activities' 
                            loading={loadingActivities}
                            canLoadMore={canLoadMoreActivities}
                            handleClickLoadMore={handleClickLoadMoreActivities}
                            feedEndMessage={`${user._id === thisUser._id ? 'You have' : user.displayName + ' has'} no more activities`}
                        />
                    </div>
                    <div>
                        <div>
                            <h3>Clubs</h3>
                            <br />
                            <div className='float-container d-flex jc-flex-start ai-flex-start fw-wrap'>
                                {loadingClubs && 
                                    <div className='loading-message'><Pending />Loading clubs...</div>
                                }
                                {clubs.map( (club, idx) => 
                                    <ClubIcon club={club} key={idx} style={{margin: 15}} />
                                )}
                                {(!loadingClubs && !loadingUser && !clubs.length) &&
                                    <p className='c-cs' style={{padding: '20px 20px'}}>
                                        {user.displayName} does not belong to any clubs
                                    </p>
                                }
                            </div>
                        </div>
                    </div>

                    <div style={{height: 100}}></div>
                    
                </div>
            </div>
            }
            
        </div>

    )
}
