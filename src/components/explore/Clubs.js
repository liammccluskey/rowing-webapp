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
            <br /><br />
            <div className='d-flex jc-space-between ai-center'>
                <input type='text' placeholder='Find a Club' />
                <button onClick={handleCreateClub}className='solid-btn-secondary'>Create a Club</button>
            </div>
            <br />
            {loading ?  
                <Loading />
                : 
                <table style={{width: '100%'}} className='data-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Members</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((club, index) => 
                            <tr 
                                key={index}
                                onClick={()=>handleClickClub(club)}
                            >
                                <td>
                                    <div 
                                        className='d-flex jc-flex-start ai-flex-start'
                                        style={{gap: '10px'}}
                                    >
                                        <img 
                                            src={club.iconURL}
                                            height='50px' width='50px' 
                                            style={{ borderRadius: '5px'}}
                                        />
                                        <h4>{club.name}</h4>
                                    </div>
                                    
                                </td>
                                <td>
                                    {`${club.memberUIDs.length} Member${club.memberUIDs.length != 1 ? 's':''}`}
                                </td>
                                <td style={{textAlign: 'right'}}>
                                    <button onClick={() => handleJoinClub(club)} className='clear-btn-secondary'>Join</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
        </div>
        
    </div>
        
    )
}