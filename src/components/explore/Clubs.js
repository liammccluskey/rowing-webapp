import React, {useState, useEffect} from 'react'
import ExploreHeader from './ExploreHeader'
import MainHeader from '../headers/MainHeader'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Clubs() {
    const [clubs, setClubs] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/clubs/search')
                setClubs(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
    <div>
        <MainHeader />
        <ExploreHeader subPath='/clubs' />
        <div className='main-container'>
            <div style={{margin: '40px 0px'}} className='d-flex jc-space-between ai-center'>
                <input type='text' placeholder='Find a Club' />
                <button className='solid-btn'>Create a Club</button>
            </div>
            {!clubs ? <p>Loading...</p> : 
                <div>
                    {clubs.map(club => 
                        <div key={club._id} className='main-subcontainer' onClick={()=>console.log('clicked club')}>
                            <h4>{club.name}</h4>
                            <p>{`Number of Members: ${club.memberUIDs.length}`}</p>
                        </div>
                    )}
                </div>
            }
        </div>
        
    </div>
        
    )
}