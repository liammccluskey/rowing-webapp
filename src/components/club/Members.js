import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import ClubHeader from './ClubHeader'
import {useParams, useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Members() {
    const {clubURL} = useParams()
    const history = useHistory()
    const {thisUser} = useAuth()

    const [club, setClub] = useState()
    const [membership, setMembership] = useState()
    const [members, setMembers] = useState()
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [clubURL])

    useEffect(() => {
        fetchMembers()
    }, [club])

    
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

    return (
        <div>
            <MainHeader style={{position: 'sticky', top: 0, zIndex: 1000}}/>
            {loading ? <Loading /> : !club ? <h2 style={{paddingTop: 40}}>We couldn't find a club at that link</h2> :
            <div >
                <ClubHeader title={club.name} subPath='/members' 
                    fetchData={fetchData} 
                    club={club} members={members} membership={membership}
                /> 
                <div className='main-container' style={{paddingBottom: 200}}>
                    <br /><br />
                    <h3>Admins</h3>
                    <br />
                    <div className='float-container'>
                        <table style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin, idx) => (
                                    <tr key={idx}>
                                        <td className='d-flex ai-center'> 
                                            {admin.iconURL ? 
                                                <img className='user-icon d-inline' src={admin.iconURL} />
                                                :
                                                <div className='user-icon-default'>
                                                    <i className='bi bi-person' />
                                                </div>
                                            }
                                            <h4 className='page-link d-inline' onClick={() => history.push(`/athletes/${admin._id}`)}>
                                                {admin.displayName}
                                            </h4>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br /><br />
                    <h3>Members</h3>
                    <br />
                    <div className='float-container'>
                        <table style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, idx) => (
                                    <tr key={idx}>
                                        <td className='d-flex ai-center'>
                                            {member.iconURL ? 
                                                <img className='user-icon d-inline' src={member.iconURL} />
                                                :
                                                <div className='user-icon-default'>
                                                    <i className='bi bi-person' />
                                                </div> 
                                            }
                                            <h4 className='page-link d-inline' onClick={() => history.push(`/athletes/${member.uid}`)}>
                                                {member.displayName}
                                            </h4>
                                        </td>
                                        
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(members && !members.length) && 
                            <h4 className='c-cs' style={{padding: '20px 15px'}}>{`${club.name} currently has no members`}</h4>
                        }
                    </div>
                </div>
            </div>
            }
        </div>
    )
}