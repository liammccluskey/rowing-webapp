
import React, { useState, useEffect } from 'react'
import {useParams, useHistory} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MainHeader from '../headers/MainHeader'
import AthleteHeader from './AthleteHeader'
import ActivityCard from '../feed/ActivityCard'
import Loading from '../misc/Loading'
import Pending from '../misc/Pending'
import axios from 'axios'

import ClubIcon from '../icons/ClubIcon'

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

    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(true)

    useEffect(() => {
        console.log('fetching athlete data')
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
        async function fetchActivities() {
            setLoadingActivities(true)
            try {
                const res = await api.get(`/activities/search?user=${userID}&page=1&sortby=-createdAt&pagesize=15`)
                setActivities(res.data.activities)
            } catch (error) {
                console.log(error.message)
            }
            setLoadingActivities(false)
        }
        async function fetchClubs() {
            const url = `/clubmemberships/user/${userID}`
            const res = await api.get(url)
            setClubs(res.data)
            setLoadingClubs(false)
        }
        fetchUser()
        fetchActivities()
        fetchClubs()
    }, [userID])

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, zIndex: 1000}} />
            {(!loadingUser && !user) && <h2 style={{paddingTop: 40}}>We couldn't find an athlete at that link</h2>}
            {(!loadingUser && user) &&
            <div>
                <AthleteHeader user={user} subPath='/' />
                <br /><br />
                <div className='main-container' style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 50 }}>
                    <div>
                        <h3>Recent Activities</h3>
                        <br />
                        {(!loadingActivities && !loadingUser && activities.length > 0) &&
                            activities.map((ac, idx) => <ActivityCard activity={ac} key={idx} />)   
                        }
                        {(!loadingActivities && !loadingUser && !activities.length) &&
                            <div className='float-container'>
                                <p className='c-cs' style={{padding: '20px 20px'}}>
                                    {user.displayName} has no recent activities
                                </p>
                            </div>
                        }
                    </div>
                    <div>
                        <h3>Clubs</h3>
                        <br />
                        <div className='float-container d-flex jc-flex-start ai-flex-start fw-wrap'>
                            {loadingClubs && <div className='loading-message'><Pending />Loading clubs...</div>}
                            {clubs.map( (club, idx) => <ClubIcon club={club} key={idx} style={{margin: 15}} />)}
                            {(!loadingClubs && !loadingUser && !clubs.length) &&
                                <p className='c-cs' style={{padding: '20px 20px'}}>
                                    {user.displayName} does not belong to any clubs
                                </p>
                            }
                        </div>
                    </div>
                    
                </div>
            </div>
            }
            
        </div>

    )
}
