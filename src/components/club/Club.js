import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import ClubHeader from './ClubHeader'
import SessionCard from '../feed/SessionCard'
import Loading from '../misc/Loading'
import {useAuth} from '../../contexts/AuthContext'
import {useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Club(props) {
    const {clubURL} = useParams()
    const {thisUser} = useAuth()

    const [members, setMembers] = useState()
    const [membership, setMembership] = useState()
    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)

    const [sessions, setSessions] = useState([])
    const [loadingSessions, setLoadingSessions] = useState(true)

    useEffect( () => {
        fetchData()
    }, [clubURL])

    async function fetchData() {
        try {
            const res = await api.get(`/clubs/customURL/${clubURL}`)
            setClub(res.data)
            await __fetchMembers(res.data._id)
            await fetchSessions(res.data._id)
        } catch(error) {
            console.log(error)
        }
        setLoading(false)
    }

    async function __fetchMembers(clubID) {
        try {
            let res = await api.get(`/clubmemberships/club/${clubID}`)
            setMembers(res.data)
            res = await api.get(`/clubmemberships/ismember?user=${thisUser._id}&club=${clubID}`)
            setMembership(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    function fetchMembers() {
        if (!club) {return}
        __fetchMembers(club._id)
    }

    async function fetchSessions(clubID) {
        try {
            const res = await api.get(`/sessions/feed/club/${clubID}`)
            setSessions(res.data)
        } catch (error) { console.log(error) }
        setLoadingSessions(false)
    }

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, zIndex: 1000}}/>
            {loading ? <Loading /> : !club ? <h2 style={{paddingTop: 40}}>We couldn't find a club at that link</h2> :
            <div>
                <ClubHeader title={club.name} subPath='/general' 
                    fetchData={fetchMembers} 
                    club={club} members={members} membership={membership}
                />
                <br /><br />
                <div className='main-container' style={{minHeight: '100vh', display: 'grid', gridTemplateColumns: '2fr 1fr'}}>
                    <div>
                        <h3>Recent Sessions</h3>
                        <br />
                        {( !loadingSessions && sessions.length > 0) &&
                            sessions.map( (session, idx) => session.club && <SessionCard session={session} parentID={session._id} />)
                        }

                    </div>
                    
                </div>
            </div>
            }
        </div>
    )
}