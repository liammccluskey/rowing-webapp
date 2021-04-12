import React, {useState, useEffect} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function MembersInfoCard(props) {
    const {thisUser} = useAuth()
    const [session, setSession] = useState(props.session)

    useEffect(() => {
        setSession(props.session)
    }, [props])

    async function handleClickJoin() {
        try {
            await api.patch(`/sessions/${session._id}/join`, {user: thisUser._id})
        } catch (error) {
            console.log(error)
        }
        props.fetchSession()
    }

    return (
        <div style={{...props.style}}>
            <div>
                <div className='d-flex jc-space-between ai-center'>
                    <h4 style={{fontWeight: '500'}}>Members <small>( {session.members.length} )</small></h4>
                    <button 
                        onClick={handleClickJoin} 
                        className='solid-btn-secondary'
                        hidden={session.members.some(m => m._id === thisUser._id)}
                    >
                        Join
                    </button>
                </div>
                <table style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {session.members.map(member => (
                            <tr>
                                <td >{member.displayName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}