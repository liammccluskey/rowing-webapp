import React, {useEffect, useRef, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import DatePicker from '../misc/DatePicker'
import axios from 'axios'
import moment from 'moment'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function NewSessionForm(props) {
    const {thisUser} = useAuth()
    const {setMessage} = useMessage()
    const sessionTitleRef = useRef()
    const sessionPrivacyRef = useRef()

    const [sessionMoment, setSessionMoment] = useState(moment())

    // workout items
    const maxItems = 4
    const itemExamples = ['ex.  2k Warmup', 'ex.  15k Steady State', '', '']
    const [hideItems, setHideItems] = useState([
        false, false, true, true
    ])
    const [visibleItems, setVisibleItems] = useState(2)
    const [sessionItems, setSessionItems] = useState( Array(maxItems).fill('') )


    async function handleCreateSession(e) {
        e.preventDefault()
        const sessionData = {
            title: sessionTitleRef.current.value,
            hostUser: thisUser._id,
            startAt: sessionMoment.toDate(),
            isAccessibleByLink: sessionPrivacyRef.current.value === 'link',
            club: ['link', 'self'].includes(sessionPrivacyRef.current.value) ? undefined : sessionPrivacyRef.current.value,
            workoutItems: sessionItems.filter((item, i) => i < visibleItems)
        }
        try {
            const res = await api.post('/sessions', sessionData)
            setMessage({title: 'Created session', isError: false, timestamp: moment()})
            props.setShowSessionForm(false)
            props.fetchSessions()
        } catch(err) {
            setMessage({title: `Error creating session. ${err.message}`, isError: true, timestamp: moment()})
        }
    }

    function handleItemChange(e, itemIndex) {
        const items = [...sessionItems]
        items[itemIndex] = e.target.value
        setSessionItems(items)
    }

    function handleAddItem() {
        if (visibleItems === maxItems) {return}
        const hide = [...hideItems]
        for (let i = 0; i < hide.length; i++) {
            if (hide[i]) {
                hide[i] = false
                break
            }
        }
        setHideItems(hide)
        setVisibleItems(curr => curr + 1)

    }

    function handleRemoveItem(itemIndex) {
        if (visibleItems === 1) {return}
        const hide = [...hideItems]
        hide[itemIndex] = true
        setHideItems(hide)
        setVisibleItems(curr => curr - 1)
    }

    return (
        <div className='float-container'
            style={{
                display: !props.showSessionForm && 'none',
                marginBottom: props.showSessionForm ? '40px' : '0px',
                padding: '0px 30px',
                }}
        >
            <br />
            <h3 style={{ textAlign: 'left', marginBottom: '40px', fontWeight: '500'}}>Create a Workout</h3>
            <form onSubmit={handleCreateSession}>
                <div className='d-flex jc-flex-start'>
                    <div style={{flex: 1, marginRight: 30}}>
                        <div className='d-flex jc-flex-start ai-center'>
                            
                        </div> 
                        <label style={{marginRight:'20px'}}>
                            Start at<br />
                            <DatePicker initMoment={sessionMoment} setMoment={setSessionMoment}/>
                        </label>
                        <br />
                        <label>
                            Title <br />
                            <input type='text' ref={sessionTitleRef} required/>
                        </label><br /><br />
                        <label>
                            Who can join <br />
                            <select ref={sessionPrivacyRef}>
                                <option value="self">Only Me</option>
                                <option value="link">Anyone with link</option>
                                {props.myClubs.map((club, idx) => (
                                    <option key={idx} value={club._id}>
                                        {club.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        
                    </div>
                    <div style={{flex: 1}}>
                        <label>Activities</label>
                        <div >
                            {Array(maxItems).fill(null).map((item, i) => (
                                <div key={i} className='d-flex jc-space-between ai-center' 
                                    style={{display: hideItems[i] ? 'none' : 'flex'}}
                                >
                                    <input 
                                        required={i < visibleItems}
                                        placeholder={itemExamples[i]}
                                        value={sessionItems[i]} 
                                        onChange={e => handleItemChange(e, i)} 
                                        type='text'
                                        style={{display: 'block', flex: 1,  marginBottom: '5px', marginRight: 10}}
                                    />
                                    <button 
                                        type='button' className='icon-btn' 
                                        onClick={() => handleRemoveItem(i)}
                                        style={{opacity: i+1 === visibleItems && visibleItems !== 1 ? '100%' : '0%'}}
                                        disabled={i+1 !== visibleItems || visibleItems === 1}
                                    >-</button>
                                </div>
                            ))}
                            <button 
                                type='button' className='icon-btn'
                                hidden={visibleItems === maxItems}
                                onClick={handleAddItem}
                            >
                                +
                            </button>
                        </div>
                        
                    </div>   
                </div>
                <br />
                <div className='d-flex jc-space-between'>
                    <button  className='solid-btn-secondary' type='submit'>Create</button>
                    <button type='button' onClick={()=>props.setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                </div>
            </form>
            <br />
        </div>
    )
}



