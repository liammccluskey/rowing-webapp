import React, {useRef, useState} from 'react'
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
        console.log('did create session')
        const startAt = new Date(`${sessionDateRef.current.value}T${sessionTimeRef.current.value}`)
        const sessionData = {
            title: sessionTitleRef.current.value,
            hostName: currentUser.displayName,
            hostUID: currentUser.uid,
            startAt: startAt,
            isAccessibleByLink: sessionPrivacyRef.current.value === 'link',
            associatedClubID: ['link', 'self'].includes(sessionPrivacyRef.current.value) ? 'none' : sessionPrivacyRef.current.value,
            workoutItems: sessionItems.filter((item, i) => i < visibleItems)
        }
        try {
            const res = await api.post('/sessions', sessionData)
            setTimeout(() => {
                props.setShowSessionForm(false)
                props.fetchSessions()
            }, 250);
            
        } catch(err) {
            console.log(err)
        }
    }

    function handleItemChange(e, itemIndex) {
        const items = [...sessionItems]
        items[itemIndex] = e.target.value
        setSessionItems(items)
    }

    function handleAddItem() {
        console.log('did click add item. init vals')
        console.log(`visible items: ${visibleItems}`)
        console.log(hideItems)
        console.log(' new vals')
        if (visibleItems === maxItems) {return}
        const hide = [...hideItems]
        for (let i = 0; i < hide.length; i++) {
            if (hide[i]) {
                hide[i] = false
                break
            }
        }
        console.log(`visible items: ${visibleItems + 1}`)
        console.log(hide)
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
        <div
            style={{
                pointerEvents: props.showSessionForm ? 'auto' : 'none',
                opacity: props.showSessionForm ? '100%':'0%',
                height: props.showSessionForm ? 'auto': '0px',
                marginBottom: props.showSessionForm ? '30px' : '0px',
                transition: '0.3s',
                padding: '0px 20px',
                border: '1px solid var(--bc)',
                borderRadius: '5px'
                }}
        >
            <br />
            <h4 style={{ textAlign: 'center'}}>Create a Workout</h4>
            <br />
            <form onSubmit={handleCreateSession}>
                <div className='d-flex jc-flex-start' style={{gap: '40px'}}>
                    <div style={{flex: 1}}>
                        <div className='d-flex jc-flex-start ai-center'>
                            <label style={{marginRight:'20px'}}>
                                Date <br />
                                <input ref={sessionDateRef} type='date' required/>
                            </label>
                            <label>
                                Start Time <br />
                                <input ref={sessionTimeRef} type='time' required/>
                            </label>
                        </div> <br />
                        <label>
                            Title <br />
                            <input type='text' ref={sessionTitleRef} required/>
                        </label><br /><br />
                        <label>
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
                        </label>
                        
                    </div>
                    <div style={{flex: 1}}>
                        <label>Activities</label>
                        <div >
                            {Array(maxItems).fill(null).map((item, i) => (
                                <div key={i} className='d-flex jc-space-between ai-center' 
                                    style={{display: hideItems[i] ? 'none' : 'flex', gap: '10px'}}
                                >
                                    <input 
                                        required={i < visibleItems}
                                        placeholder={itemExamples[i]}
                                        value={sessionItems[i]} 
                                        onChange={e => handleItemChange(e, i)} 
                                        type='text'
                                        style={{display: 'block', flex: 1,  marginBottom: '5px'}}
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
                                type='button' className='clear-btn-secondary' 
                                style={{border: 'none'}}
                                hidden={visibleItems === maxItems}
                                onClick={handleAddItem}
                            >
                                + Add activity
                            </button>
                        </div>
                        
                    </div>   
                </div>
                <br />
                <div className='d-flex jc-space-between'>
                    <button  className='clear-btn-secondary' type='submit'>Create</button>
                    <button type='button' onClick={()=>props.setShowSessionForm(false)} className='clear-btn-cancel'>Close</button>
                </div>
            </form>
            <br />
        </div>
    )
}



