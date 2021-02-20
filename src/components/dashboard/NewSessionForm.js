import React, {useRef} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function NewSessionForm(props) {
    const {currentUser} = useAuth()
    const sessionTitleRef = useRef()
    const sessionDateRef = useRef()
    const sessionTimeRef = useRef()
    const sessionPrivacyRef = useRef()

    async function handleCreateSession(e) {
        e.preventDefault()
        console.log('did create session')
        const startAt = new Date(`${sessionDateRef.current.value}T${sessionTimeRef.current.value}`)
        const sessionData = {
            title: sessionTitleRef.current.value,
            hostName: currentUser.displayName,
            hostUID: currentUser.uid,
            startAt: startAt,
            isAccessibleByLink: sessionPrivacyRef.current.value === 'link',
            associatedClubID: ['link', 'self'].includes(sessionPrivacyRef.current.value) ? 'none' : sessionPrivacyRef.current.value
        }
        try {
            const res = await api.post('/sessions', sessionData)
            setTimeout(() => {
                props.setShowSessionForm(false)
                props.fetchSessions()
            }, 500);
            
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className='float-container'
            style={{
                opacity: props.showSessionForm ? '100%':'0%',
                height: props.showSessionForm ? '410px': '0px',
                marginBottom: props.showSessionForm ? '30px' : '0px',
                transition: '0.3s',
                padding: '0px 20px'
                }}
        >
            <br />
            <h3 style={{ textAlign: 'center'}}>Create a Workout</h3>
            <br />
            <form onSubmit={handleCreateSession}>
                <label>
                    Title <br />
                    <input style={{width: '300px'}} type='text' ref={sessionTitleRef} required/>
                </label> <br /><br />

                <div className='d-flex jc-flex-start ai-center'>
                    <label style={{marginRight:'30px'}}>
                        Date <br />
                        <input ref={sessionDateRef} type='date' required/>
                    </label>
                    <label>
                        Start Time <br />
                        <input ref={sessionTimeRef} type='time' required/>
                    </label>
                </div> <br />
                <label >
                    Who can join <br />
                    <select ref={sessionPrivacyRef}>
                        <option value="self">Only Me</option>
                        <option value="link">Anyone with link</option>
                        {props.myClubs.map(club => (
                            <option value={club._id}>
                                {club.name}
                            </option>
                        ))}
                    </select>
                </label><br /><br /><br />
                <div className='d-flex jc-space-between'>
                    <button  className='clear-btn-secondary' type='submit'>Create</button>
                    <button type='button' onClick={()=>props.setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                </div>
            </form>
            <br />
        </div>
    )
}



