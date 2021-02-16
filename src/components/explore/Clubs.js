import React, {useState, useEffect} from 'react'
import ExploreHeader from './ExploreHeader'
import MainHeader from '../headers/MainHeader'
import {useHistory} from 'react-router-dom'
import {storage} from '../../firebase'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'
import Loading from '../misc/Loading'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Clubs() {
    const {currentUser} = useAuth()
    const [clubs, setClubs] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/clubs/search')
                setClubs(res.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    function handleCreateClub() {
        history.push('/club-create')
    }

    function handleClickClub(club) {
        history.push(`/clubs/${club.customURL}`)
    }

    async function handleJoinClub(club) {
        console.log(`Trying to join club with UID: ${currentUser.uid}`)
        try {
            await api.patch(`/clubs/${club._id}/join`, {uid: currentUser.uid})
            history.push(`/clubs/${club.customURL}`)
        } catch(error) {
            console.log(error)
        }
    }

    return (
    <div>
        <MainHeader />
        <ExploreHeader subPath='/clubs' />
        <div className='main-container'>
            <div style={{margin: '40px 0px'}} className='d-flex jc-space-between ai-center'>
                <input type='text' placeholder='Find a Club' />
                <button onClick={handleCreateClub}className='solid-btn'>Create a Club</button>
            </div>
            {loading ?  <Loading />: 
                <div className='float-container'>
                    {clubs.map((club, index) => 
                        <div key={club._id} className='main-subcontainer' onClick={()=>handleClickClub(club)}>
                            <div className='d-flex jc-space-between ai-center'>
                                <div className='d-flex jc-flex-start'>
                                    <img 
                                        src={club.iconURL}
                                        height='50px' width='50px' 
                                        style={{ borderRadius: '5px'}}
                                    />
                                    <div style={{margin: '0px 10px'}}>
                                        <h4 style={{margin: '0px 10px', marginBottom: '5px'}}>{club.name}</h4>
                                        <p style={{margin: '0px 10px'}}>{`${club.memberUIDs.length} Member${club.memberUIDs.length != 1 ? 's':''}`}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleJoinClub(club)} className='clear-btn-secondary'>Join</button>
                                
                            </div>
                            
                        </div>
                    )}
                </div>
            }
        </div>
        
    </div>
        
    )
}