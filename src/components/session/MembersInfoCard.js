import React, {useState, useEffect} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import Loading from '../misc/Loading'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function MembersInfoCard(props) {
    const {currentUser} = useAuth()
    const [session, setSession] = useState(props.session)
    const [members, setMembers] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/sessions/${props.session._id}/members`)
                setMembers(res.data)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
        setSession(props.session)
    }, [props.session])

    return (
        <div style={{...props.style}}>
            {loading ? <Loading /> :
            <div>
                <div className='d-flex jc-space-between ai-center'>
                    <h4 style={{fontWeight: '500'}}>Members <small>( {members.length} )</small></h4>
                    <button 
                        onClick={props.handleClickJoin} 
                        className='solid-btn-secondary'
                        hidden={session.memberUIDs.includes(currentUser.uid)}
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
                        {members.map(member => (
                            <tr>
                                <td >{member.displayName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            }
            
        </div>
    )
}