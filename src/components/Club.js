import React, {useState, useEffect} from 'react'
import MainHeader from './headers/MainHeader'
import SubHeader from './headers/SubHeader'
import Loading from './misc/Loading'
import {useParams, useLocation} from 'react-router-dom'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Club(props) {
    const {clubURL} = useParams()
    const location = useLocation()
    const [club, setClub] = useState()
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        async function fetchData() {
            try {
                const res = await api.get(`/clubs/customURL/${clubURL}`)
                setClub(res.data)
                console.log(res.data)
            } catch(error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchData()
    },[clubURL])

    return (
        <div>
            <MainHeader />
            {loading ? <Loading /> : !club ? <h2>It looks like there is no Club at that link</h2> :
            <div>
                <SubHeader 
                    title={club.name}
                    path={location.pathname}
                    imgURL={club.iconURL}
                />
                <p>{club.description}</p>
            </div>
            }
        </div>
    )
}