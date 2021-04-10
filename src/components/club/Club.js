import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import ClubHeader from './ClubHeader'
import Loading from '../misc/Loading'
import {useAuth} from '../../contexts/AuthContext'
import {useParams, useLocation} from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Club(props) {
    const {clubURL} = useParams()
    const {currentUser} = useAuth()
    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        fetchData()
    },[clubURL])

    async function fetchData() {
        try {
            const res = await api.get(`/clubs/customURL/${clubURL}`)
            setClub(res.data)
            console.log(res.data)
        } catch(error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> : !club ? <h2 style={{paddingTop: 40}}>We couldn't find a club at that link</h2> :
            <div>
                <ClubHeader title={club.name} subPath='/general' fetchData={fetchData} club={club}/>
                <div className='main-container' style={{height: '100vh'}}>
                    <br /><br />
                    <p>{club.description}</p>

                </div>
            </div>
            }
        </div>
    )
}