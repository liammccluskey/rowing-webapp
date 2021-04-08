import React, {useState, useEffect} from 'react'
import MainHeader from '../headers/MainHeader'
import ClubHeader from './ClubHeader'
import {useParams} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Members() {
    const {clubURL} = useParams()
    const {currentUser} = useAuth()

    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const res = await api.get(`/clubs/customURL/${clubURL}`)
            setClub(res.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> : !club ? <h2 style={{paddingTop: 40}}>We couldn't find a club at that link</h2> :
            <div >
                <ClubHeader title={club.name} subPath='/members' fetchData={fetchData} club={club} /> 
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
                                {club.admins.map((admin, idx) => (
                                    <tr key={idx}>
                                        <td className='page-link'>{admin.displayName}</td>
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
                                {club.members.map((member, idx) => (
                                    <tr key={idx}>
                                        <td className='page-link'>{member.displayName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}