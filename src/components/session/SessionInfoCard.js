import React, {useEffect, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import moment from 'moment'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})
export default function SessionInfoCard(props) {
    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)
    const {currentUser} = useAuth()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/clubs/${props.session.associatedClubID}`)
                setClub(res.data)
                
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        if (props.session.associatedClubID !== 'none') {
            fetchData()
        }
    }, [])
    return (
        <div 
            style={{...props.style}}
            className='d-flex jc-flex-start ai-flex-start'
        >
            <img 
                height='50px' width='50px' 
                src={club ? club.iconURL : currentUser.photoURL} 
                style={{borderRadius: '5px', marginRight: '10px'}}
            />
            <div>
                <h4>{club ? club.name : currentUser.displayName}</h4>
                <h5 
                    style={{
                        color: 'var(--color-secondary)',
                        marginTop: '10px'
                    }}
                >
                    {moment(props.session.startAt).calendar()}
                </h5>
            </div>
        </div>
    )
}