import React, {useEffect, useState} from 'react'
import MainHeader from '../headers/MainHeader'
import ExploreHeader from './ExploreHeader'
import Loading from '../misc/Loading'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Sessions() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/sessions')
                setSessions(res.data)
                setLoading(false)
            } catch(error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    async function handleJoinSessionWithID(sessionID) {
        await api.patch(`/${sessionID}/join`)
        history.push(`/sessions/${sessionID}`)
    }

    return (
        <div>
            <MainHeader />
            <ExploreHeader subPath='/sessions' />
            {loading ? <Loading /> :
                <div className='main-container'>
                    <div style={{margin: '40px 0px'}} className='d-flex jc-space-between ai-center'>
                        <input type='text' placeholder='Find a Session' />
                        <button className='solid-btn'>Create a Session</button>
                    </div>
                    {!sessions ? <p>Loading...</p> : 
                        <div>
                            {sessions && sessions.map(session => 
                                <div key={session._id} className='main-subcontainer' onClick={()=>console.log('clicked session')}>
                                    <div className='d-flex jc-space-between ai-center'>
                                        <h4>{session.title}</h4>
                                        <p>{`${session.memberUIDs.length}  Members`}</p>
                                    </div>
                                    <p>{`Host Name: ${session.hostName}`}</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
            }
            
            
        </div>
    )
}