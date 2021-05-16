import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import SubHeader from '../headers/SubHeader'
import ClubHeader from './ClubHeader'
import SessionCard from '../feed/SessionCard'
import Loading from '../misc/Loading'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import {useParams, useHistory } from 'react-router-dom'
import { formatNumber, formatUnit } from '../../scripts/Numbers'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Club(props) {
    const {clubURL} = useParams()
    const {thisUser} = useAuth()
    const {setMessage} = useMessage()
    const history = useHistory()

    const [members, setMembers] = useState()
    const [membership, setMembership] = useState()
    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)

    const [sessions, setSessions] = useState([])
    const [loadingSessions, setLoadingSessions] = useState(true)

    const [canEditClub, setCanEditClub] = useState(false)

    useEffect( () => {
        fetchData()
    }, [clubURL])

    useEffect(() => {
        if (!membership) {return}
        setCanEditClub(membership.role >= 1)
    }, [membership])

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

    function routeToMembers() {
        history.push(`/clubs/${clubURL}/members`)
    }

    function handleClickEditClub() {
        if (!membership || membership.role < 1) {
            setMessage({title: 'You do not have permission to edit this club', isError: true, timestamp: moment()})
        } else {
            history.push(`/clubs/${clubURL}/edit`)
        }
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
                <div className='main-container' style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 50}}>
                    <div>
                        <h3>Recent Sessions</h3>
                        <br />
                        {( !loadingSessions && sessions.length > 0) &&
                            sessions.map( (session, idx) => session.club && <SessionCard session={session} parentID={session._id} />)
                        }

                    </div>
                    <div style={{ position: 'sticky', top: 'calc(var(--main-nav-height) + 20px)'}}>
                        <div className='float-container'>
                            <div className='d-flex jc-space-between ai-center' 
                                style={{backgroundColor: 'var(--tint-color-translucent)', padding: '15px 20px'}} 
                            >
                                <h4 className='c-tc'>Club Information</h4>
                                {canEditClub && 
                                    <i className='bi bi-pencil clear-icon-btn' onClick={handleClickEditClub}/>
                                }
                            </div>
                            
                            <div style={{padding: 20}}>
                                <p>{club.description}</p>
                                <br />
                                <div className='d-flex jc-space-around ai-center' >
                                    <div style={{ textAlign: 'center'}}>
                                        <h3>{formatNumber(members.length)}</h3>
                                        <h5 className='page-link c-cs' onClick={routeToMembers}>{formatUnit('Member', members.length)}</h5>
                                    </div>
                                    <div style={{textAlign: 'center', display: 'none'}}>
                                        <h3>{formatNumber(12345)}</h3>
                                        <h5 className='page-link c-cs' onClick={routeToMembers}>Sessions</h5>
                                    </div>
                                </div>
                                <br />
                                <div className='d-flex jc-flex-start ai-center'>
                                    <p className='mr-10'>{club.isPrivate ? 'Invite-only Club' : 'Public Club'}</p>
                                    <i className={`bi bi-${club.isPrivate ? 'lock':'unlock'}-fill c-cs`} style={{fontSize: 20}} />
                                </div>
                            </div>
                            <div className='d-flex jc-flex-start ai-center' 
                                style={{borderTop: '1px solid var(--bc)', padding: '15px 20px'}}
                            >
                                <i className='bi bi-calendar-plus mr-10' />
                                <p>Created {moment(club.createdAt).format('LL')}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{height: 500}}></div>
                    
                </div>
            </div>
            }
        </div>
    )
}