import React, {useEffect, useState} from 'react'
import MainHeader from '../headers/MainHeader'
import ExploreHeader from './ExploreHeader'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Sessions() {
    const [sessions, setSessions] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/sessions')
                setSessions(res.data)
            } catch(error) {
                console.log(error)
            }
        }
        fetchData()
    })
    return (
        <div>
            <MainHeader />
            <ExploreHeader subPath='/sessions' />
            <div className='main-container'>
                <div style={{margin: '40px 0px'}} className='d-flex jc-space-between ai-center'>
                    <input type='text' placeholder='Find a Session' />
                    <button className='solid-btn'>Create a Session</button>
                </div>
                {!sessions ? <p>Loading...</p> : 
                    <div>
                        {sessions.map(session => 
                            <div key={session._id} className='main-subcontainer' onClick={()=>console.log('clicked session')}>
                                <div className='d-flex jc-space-between ai-center'>
                                    <h4>{session.title}</h4>
                                    <p>{`${session.members.length}  Members`}</p>
                                </div>
                                <p>{`Host Name: ${session.hostName}`}</p>
                            </div>
                        )}
                    </div>
                }
            </div>
            
        </div>
    )
}