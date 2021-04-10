import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MainHeader from '../headers/MainHeader'
import AthleteHeader from './AthleteHeader'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Athlete() {
    const {currentUser} = useAuth()
    const {uid} = useParams()

    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            try {
                const res = await api.get(`/users/${uid}`)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [uid])

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> : !user ? <h2 style={{paddingTop: 40}}>We couldn't find an athlete at that link</h2> :
            <div>
                <AthleteHeader user={user} subPath='/' />
            </div>
            }
        </div>

    )
}
