import React, { useState, useEffect } from 'react'
import AthleteHeader from './AthleteHeader'
import MainHeader from '../headers/MainHeader'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import {useParams, useHistory} from 'react-router-dom'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Following() {
    const {currentUser, thisUser} = useAuth()
    const {setMessage} = useMessage()
    const {userID} = useParams()
    const history = useHistory()

    const [user, setUser] = useState()
    const [users, setUsers] = useState([])            // follow(ers/ees)
    const [loading, setLoading] = useState(true)

    const [followType, setFollowType] = useState('followers')

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            try {
                const res = await api.get(`/users/${userID}`)
                setUser(res.data)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
        fetchFollowing()
    }, [userID])

    useEffect(() => {
        fetchFollowing()
    }, [followType])

    async function fetchFollowing() {
        try {
            const res = await api.get(`/follows/user/${userID}/${followType}`)
            setUsers(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <MainHeader />
            {(!loading && !user) && <h2 style={{paddingTop: 40}}>We couldn't find an athlete at that link</h2>}
            {(!loading && user) &&
            <div>
                <AthleteHeader user={user} subPath='/following' fetchData={fetchFollowing}/>
                <div className='main-container'>
                    <br />
                    <br />
                    <select value={followType} onChange={e => setFollowType(e.target.value)}>
                        <option value='followees'>
                            {thisUser._id === userID ? "I'm following" : `${user.displayName} is following`}
                        </option>
                        <option value='followers'>
                            {thisUser._id === userID ? "Following me" : `Following ${user.displayName}`}
                        </option>
                    </select>
                    <br /><br />
                    <div className='float-container'>
                        <table style={{width: '100%'}}>
                            <thead>
                                <tr><th>Name</th></tr>
                            </thead>
                            <tbody>
                                {users && users.map((u, idx) => (
                                    <tr key={idx}>
                                        <td className='d-flex jc-flex-start ai-center'>
                                            {u.iconURL ? 
                                                <img src={u.iconURL} className='user-icon' />
                                                :
                                                <div className='user-icon-default'>
                                                    <i className='bi bi-person' />
                                                </div>
                                            }
                                            <h4 className='page-link' onClick={() => history.push(`/athletes/${u._id}`)}>
                                                {u.displayName}
                                            </h4>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(users && !users.length) && 
                            <h4 className='c-cs' style={{padding: '20px 15px'}}> {followType === 'followers' ? 
                                `${user.displayName} currently has no followers`
                                :
                                `${user.displayName} is not following anyone`
                            }</h4>
                        }
                    </div>
                    
                </div>
            </div>
            }
            
        </div>
    )
}