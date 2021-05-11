import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import moment, { max } from 'moment'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'

const socket = io(process.env.REACT_APP_API_BASE_URL,  { transports : ['websocket'] })

export default function Chat(props) {
    const {thisUser} = useAuth()
    const {setMessage} = useMessage()
    
    const [messages, setMessages] = useState([
        {
            sender: { displayName: 'Team Ergsync', iconURL: '/images/logo-0.png' },
            message: 'Please note that chat messages are not saved.',
            timestamp: moment().toDate()
        }
    ])
    const [users, setUsers] = useState([])

    const [chatMessage, setChatMessage] = useState('')
    const [selectedTab, setSelectedTab] = useState(0) // 0: messages, 1: participants

    useEffect(() => {
        if (!socket.connected) {socket.connect()}
        socket.on('update_room_members', data => {
            console.log('did receive update_room_members')
            setUsers(data)
            scrollToBottom()
        })
        socket.on('receive_message', data => {
            setMessages(curr => [...curr, data])
            scrollToBottom()
            console.log('did receive message')
        })
        joinRoom()

        return () => socket.disconnect()
    }, [])

    const [reconnectionAttempts, setReconnectionAttempts] = useState(0)
    useEffect(() => {
        const maxReconnectionAttempts = 50
        if (!socket.connected && reconnectionAttempts < maxReconnectionAttempts) {
            socket.connect()
            setReconnectionAttempts(curr => curr + 1)
        } else if (!socket.connected && reconnectionAttempts >= maxReconnectionAttempts) {
            const errorMessage = {
                sender: { displayName: 'Team Ergsync', iconURL: '/images/logo-0.png' },
                message: 'Error connecting to chat. Please reload the page to continue receiving and sending messages.',
                timestamp: moment().toDate()
            }
            setMessages(curr => [...curr, errorMessage])
        }
    }, [socket.connected])

    function joinRoom() {
        const data = {
            user: {
                displayName: thisUser.displayName,
                iconURL: thisUser.iconURL,
                _id: thisUser._id
            },
            room: props.roomID,
        }
        socket.emit('join_room', data)
    }

    function handleSubmitMessage(e) {
        function sendMessage() {
            const data = {
                sender: {
                    displayName: thisUser.displayName,
                    iconURL: thisUser.iconURL,
                    _id: thisUser._id 
                },
                room: props.roomID,
                message: chatMessage,
                timestamp: moment().toDate()
            }
            try {
                socket.emit('send_message', data)
            } catch (error) {
                console.log(error)
            }
        }
        e.preventDefault()
        console.log('did call submit meessage')
        if (!chatMessage.length) {console.log('no message'); return}
        sendMessage()
        console.log('did send message')
        setChatMessage('')

    }

    function scrollToBottom() {
        const container = document.getElementById('messages-container')
        if (!container) {return}
        container.scrollTop = container.scrollHeight
    }

    return (
        <div className='chat-container'>
            <div className='chat-header d-flex jc-space-between ai-center'>
                <h4 className='fw-m'>Group Chat</h4>
                <div className='d-flex jc-flex-end ai-center'>
                    <div className={`icon-tab-option${selectedTab === 0 ? '-selected':''} tooltip`} onClick={() => setSelectedTab(0)}>
                        <i className='bi bi-chat-square-dots-fill' />
                        <div className='tooltip-text'><h6>Chat</h6></div>
                    </div>
                    <div className={`icon-tab-option${selectedTab === 1 ? '-selected':''} tooltip`} onClick={() => setSelectedTab(1)}>
                        <i className='bi bi-people-fill' />
                        <div className='tooltip-text'><h6>Members</h6></div>
                    </div>
                </div>
            </div>
            {selectedTab === 0 ? 
                <div>
                    <div className='messages-container' id='messages-container' style={{height: props.height}} >
                        <br /><br /><br />
                        {messages.map( (m, idx) =>
                            <div key={idx} className={m.sender._id === thisUser._id ? 'self-chat-message' : 'notself-chat-message'}>
                                { (m.sender._id !== thisUser._id && true ) && 
                                    <img src={m.sender.iconURL} className='user-icon-small' style={{margin: 10, marginTop: 0}} />
                                }
                                {m.sender._id === thisUser._id ? 
                                    <div>
                                        <h5 className='c-cs mb-3'>{'You, '}{moment(m.timestamp).format('LT')}</h5>
                                        <p className='float-container message-text-container'>{m.message}</p>
                                    </div>
                                    :
                                    <div>
                                        <h5 className='c-cs mb-3'>{m.sender.displayName + ', '}{moment(m.timestamp).format('LT')}</h5>
                                        <p className='float-container message-text-container'>{m.message}</p>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                    <div style={{backgroundColor: 'var(--bgc-light)', position: 'absolute', height: 40, marginTop: -40, width: '100%'}}>
                        <form onSubmit={handleSubmitMessage} className='d-flex jc-center message-input-container'>
                            <input value={chatMessage} placeholder='Say something' style={{flex: 1,border: 'none', margin: 0}} type='text' 
                                onChange={e => setChatMessage(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
                :
                <div style={{height: props.height, overflow: 'scroll', padding: '0px 20px'}}>
                    <br /><br /><br />
                    {users.map( (u, idx) => 
                        <div key={idx} className='d-flex jc-flex-start ai-center' style={{margin: 10}}>
                            <img src={u.iconURL} className='user-icon-small mr-10' />
                            <p>{u.displayName}</p>
                        </div>
                    )}
                    
                </div>
            }
            
            
                
        </div>
    )
}