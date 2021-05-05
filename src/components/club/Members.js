import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import ClubHeader from './ClubHeader'
import AdminCard from './AdminCard'
import PendingMemberCard from './PendingMemberCard'
import MemberCard from './MemberCard'
import {useParams, useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import Loading from '../misc/Loading'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Members() {
    const {clubURL} = useParams()
    const history = useHistory()
    const {thisUser} = useAuth()
    const {setMessage} = useMessage()

    const [club, setClub] = useState()
    const [membership, setMembership] = useState()

    const [members, setMembers] = useState([])
    const [admins, setAdmins] = useState([])
    const [pendingMembers, setPendingMembers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [clubURL])

    async function fetchData() {
        try {
            const res = await api.get(`/clubs/customURL/${clubURL}`)
            setClub(res.data)
            await __fetchMembers(res.data._id)
        } catch(error) {
            console.log(error)
        }
        setLoading(false)
    }

    async function __fetchMembers(clubID) {
        try {
            let res = await api.get(`/clubmemberships/club/${clubID}`)
            setPendingMembers(res.data.filter(m => m.role === -1))
            setMembers(res.data.filter(m => m.role === 0))
            setAdmins(res.data.filter(m => m.role > 0))
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
    
    async function handleClickMakeOwner(userID) {
        try {
            const res = await api.patch('/clubmemberships/transferOwnership', {fromUser: thisUser._id, toUser: userID, club: club._id})
            setMessage({title: res.data.message, isError: false, timestamp: moment()})
            fetchMembers()
        } catch (error) {
            setMessage({title: error.response.data.message, isError: true, timestamp: moment()})
        }
    }

    async function handleClickMakeAdmin(userID) {
        try {
            const res = await api.patch('/clubmemberships/makeAdmin', {requestingUser: thisUser._id, user: userID, club: club._id})
            setMessage({title: res.data.message, isError: false, timestamp: moment()})
            fetchMembers()
        } catch (error) {
            setMessage({title: error.response.data.message, isError: true, timestamp: moment()})
        }
    }

    async function handleClickRevokeAdmin(userID) {
        try {
            const res = await api.patch('/clubmemberships/revokeAdmin', {requestingUser: thisUser._id, user: userID, club: club._id})
            setMessage({title: res.data.message, isError: false, timestamp: moment()})
            fetchMembers()
        } catch (error) {
            setMessage({title: error.response.data.message, isError: true, timestamp: moment()})
        }
    }

    async function handleClickRemove(userID) {
        try {
            const res = await api.delete(`/clubmemberships/revokeMembership?requestingUser=${thisUser._id}&user=${userID}&club=${club._id}`)
            setMessage({title: res.data.message, isError: false, timestamp: moment()})
            fetchMembers()
        } catch (error) {
            setMessage({title: error.response.data.message, isError: true, timestamp: moment()})
        }
    }

    async function handleClickAcceptRequest(userID) {
        try {
            const res = await api.patch('/clubmemberships/makeMember', {requestingUser: thisUser._id, user: userID, club: club._id})
            setMessage({title: res.data.message, isError: false, timestamp: moment()})
            fetchMembers()
        } catch (error) {
            setMessage({title: error.response.data.message, isError: true, timestamp: moment()})
        }
    }

    function handleClickDeclineRequest(userID) {
        handleClickRemove(userID)
    }

    const membershipActions = {
        handleClickMakeOwner, handleClickMakeAdmin,
        handleClickRevokeAdmin, handleClickRemove,
        handleClickAcceptRequest, handleClickDeclineRequest
    }

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, zIndex: 1000}}/>
            {loading ? <Loading /> : !club ? <h2 style={{paddingTop: 40}}>We couldn't find a club at that link</h2> :
            <div >
                <ClubHeader title={club.name} subPath='/members' 
                    fetchData={fetchMembers} 
                    club={club} members={members} membership={membership}
                /> 
                <div className='main-container' style={{paddingBottom: 200}}>
                    <br /><br />
                    <h3>Admins</h3>
                    <br />
                    <div className='float-container'>
                        {admins.map((admin, idx) => 
                            <AdminCard myMembership={membership} member={admin} membershipActions={membershipActions}/>
                        )}
                    </div>
                    <br /><br />
                    <div style={{display: (membership.role <= 0 || pendingMembers.length === 0) && 'none' }}>
                        <h3>Pending Requests to Join</h3>
                        <br />
                        <div className='float-container'>
                            {pendingMembers.map((member, idx) => 
                                <PendingMemberCard myMembership={membership} member={member} membershipActions={membershipActions} />
                            )}
                        </div>
                        <br /><br />
                    </div>
                    <h3>Members</h3>
                    <br />
                    <div className='float-container'>
                        {! members.length > 0 && 
                            <div style={{padding: 20}}>
                                <p className='c-cs'>This club has no members</p>
                            </div>
                        }
                        {members.map((member, idx) => 
                            <MemberCard myMembership={membership} member={member} membershipActions={membershipActions} />
                        )}
                    </div>
                </div>
            </div>
            }
        </div>
    )
}