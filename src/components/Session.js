import React, {useEffect, useState} from "react"
import MainHeader from "./headers/MainHeader"
import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Session(props) {
    const {params} = props.match
    const [sessionData, setSessionData] = useState({})

    useEffect(() => {
        async function fetchSession() {
            const res = await api.get(`/sessions/${params.sessionID}`)
            console.log(res.data)
            console.log(api.baseURL)
            setSessionData(res.data)
        }
        fetchSession()
    }, [])

    return (
        <div>
            <MainHeader />
            {!sessionData ? (
                <h3>Loading...</h3>
            ) : (
                <div>
                    <p>Session Host: {sessionData.hostName}</p>
                    <p>Session ID: {sessionData._id}</p>
                    <p>Session Start Time: {sessionData.startAt}</p>
                </div>

            )}
            <h1></h1>
        </div>
    )
}
