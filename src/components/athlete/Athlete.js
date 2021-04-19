
import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MainHeader from '../headers/MainHeader'
import AthleteHeader from './AthleteHeader'
import ActivityCard from '../misc/ActivityCard'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Athlete() {
    const { thisUser } = useAuth()
    const {userID} = useParams()

    const [user, setUser] = useState()
    const [loadingUser, setLoadingUser] = useState(true)


    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(true)

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
        async function fetchActivities() {
            setLoadingActivities(true)
            try {
                const res = await api.get(`/activities/search?user=${thisUser._id}&page=1&sortby=-createdAt`)
                setActivities(res.data.activities)
            } catch (error) {
                console.log(error.message)
            }
            setLoadingActivities(false)
        }
        fetchUser()
        fetchActivities()
    }, [userID])

    return (
        <div>
            <MainHeader />
            {(!loadingUser && !user) && <h2 style={{paddingTop: 40}}>We couldn't find an athlete at that link</h2>}
            {(!loadingUser && user) &&
            <div>
                <AthleteHeader user={user} subPath='/' />
                <div className='main-container'>
                    <br /><br />
                    <h3>Recent Activities</h3>
                    <br />
                    {(!loadingActivities && !loadingUser && activities.length > 0) &&
                        activities.map((ac, idx) => <ActivityCard activity={ac} key={idx} />)   
                    }
                </div>
                <div style={{height: 200}} />
            </div>
            }
            
        </div>

    )
}
