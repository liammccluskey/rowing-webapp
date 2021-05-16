import React, {useState, useEffect, useRef} from 'react'
import io from 'socket.io-client'
import moment from 'moment'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'



export default function Chat(props) {
    const {thisUser} = useAuth()

    const socket = useRef()

    const [selectedChannel, setSelectedChannel] = useState('main')
    const [channels, setChannels] = useState({ 
        main : {name: 'Group Chat', isDirect: false, channelKey: 'main', recipient: 'everyone', hasUnreadMessages: false}
    })
    
    const [messages, setMessages] = useState([ {
            sender: { displayName: 'Team Ergsync', iconURL: '/images/logo-0.png' },
            message: 'Please note that chat messages are not saved.',
            room: props.roomID, channelKey: 'main',
            timestamp: moment().toDate()
    } ])
    const [users, setUsers] = useState([])

    const [chatMessage, setChatMessage] = useState('')
    const [selectedTab, setSelectedTab] = useState(0) // 0: messages, 1: participants
    const [channelsHidden, setChannelsHidden] = useState(true)

    const messagesHeight = `calc(${props.height} - 45px)`

    useEffect(() => {

        socket.current = io(process.env.REACT_APP_API_BASE_URL,  { transports : ['websocket'] })
        socket.current.on('connect', () => {
            joinMainRoom()
        })
        socket.current.on('update_room_members', data => {
            setUsers(data)
            scrollToBottom()
        })
        socket.current.on('receive_message', data => {
            let canAccessMessage = false
            if (data.channelKey === 'main') {
                canAccessMessage = true
                setMessages(curr => [...curr, data])
            } else if ( [data.sender._id, data.recipient._id].includes(thisUser._id) ) {
                canAccessMessage = true
                setMessages(curr => [...curr, data])
                const notSelf = data.sender._id === thisUser._id ? 
                    data.recipient : data.sender
                setChannels(curr => ({
                    ...curr, 
                    [data.channelKey] : {
                        name: notSelf.displayName,
                        isDirect: true,
                        channelKey: data.channelKey,
                        recipient: notSelf, hasUnreadMessages: true
                    }
                }))
            }
            scrollToBottom()
        })

        socket.current.connect()
        return () => {
            socket.current.disconnect()
        }
    }, [])

    useEffect(() => {
        setChannels(curr => ({
            ...curr, 
            [selectedChannel]: {
                ...curr[selectedChannel],
                hasUnreadMessages: false
            }
        }))
    }, [selectedChannel, channelsHidden])

    function joinMainRoom() {
        const data = {
            user: {
                displayName: thisUser.displayName,
                iconURL: thisUser.iconURL,
                _id: thisUser._id
            },
            room: props.roomID,
        }
        socket.current.emit('join_room', data)
    }

    function handleSubmitMessage(e) {
        e.preventDefault()
        function sendMessage() {
            const data = {
                sender: {
                    displayName: thisUser.displayName,
                    iconURL: thisUser.iconURL,
                    _id: thisUser._id
                },
                recipient: channels[selectedChannel].recipient,
                room: props.roomID,
                channelKey: selectedChannel,
                message: chatMessage,
                timestamp: moment().toDate(),
            }
            socket.current.emit('send_message', data)
        }
        e.preventDefault()
        if (!chatMessage.length) { return }
        sendMessage()
        setChatMessage('')
    }

    function scrollToBottom() {
        const container = document.getElementById('messages-container')
        if (!container) {return}
        container.scrollTop = container.scrollHeight
    }

    function handleClickChannel( isMainChannel, channel) {
        setSelectedChannel(isMainChannel ? 'main': channel.channelKey)
        setChannelsHidden(true)
        setSelectedTab(0)
    }

    function handleClickNewDirectMessage() {
        setChannelsHidden(true)
        setSelectedTab(1)
    }

    async function handleClickDirectMessage(recipient) {
        const channelKey = [thisUser._id, recipient._id].sort().join('')
        if (!channels.hasOwnProperty(channelKey)) {
            await setChannels(curr => ({
                ...curr, 
                [ channelKey ] : {
                    name: recipient.displayName,
                    isDirect: true,
                    channelKey: channelKey,
                    recipient: recipient
                }
            }))
        }
        setSelectedChannel(channelKey)
        setSelectedTab(0)
    }

    return (
        <div className='chat-container'>
            <div className='channels-wrapper' style={{width: channelsHidden && 0}}>
                <div className='channels-container' style={{height: props.height}}>
                    <div className='d-flex jc-space-between ai-center mb-10'>
                        <h4 className='fw-m'>Channels</h4>
                        <i className='bi bi-x icon-btn-circle' onClick={() => setChannelsHidden(true)} />
                    </div>
                    <div style={{paddingLeft: 0}}>
                        <h6 className='tt-u fw-m mb-5'>main chat</h6>
                        <div className='channel-option' onClick={() => handleClickChannel(true)}>
                            <p>Group Chat</p>
                            {channels.main.hasUnreadMessages && <i className='bi bi-envelope-fill' />}
                        </div>
                        <br />
                        <h6 className='tt-u fw-m mb-5'>direct messages</h6>
                        <div className='channel-option' onClick={handleClickNewDirectMessage}>
                            <p className='fw-m'>+ New direct message</p>
                        </div>
                        {Object.values(channels).filter(c => c.isDirect).map( (channel, idx) => 
                            <div key={idx} className='channel-option' onClick={() => handleClickChannel(false, channel)}>
                                <p>{channel.name}</p>
                                {channel.hasUnreadMessages && <i className='bi bi-envelope-fill' />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='chat-header d-flex jc-space-between ai-center'>
                <div className='d-flex jc-flex-start ai-center' 
                    onClick={() => setChannelsHidden(curr => !curr)} style={{cursor: 'pointer'}}
                >
                    <i className='bi bi-list mr-5 toggle-menu-icon'/>
                    {channels[selectedChannel].isDirect ?
                        <div className='d-flex jc-flex-start ai-center'>
                            <h4 className='c-cs mr-5'>@</h4>
                            <h4 className='fw-m'>{channels[selectedChannel].name}</h4>
                        </div>
                        :
                        <h4 className='fw-m'>{channels[selectedChannel].name}</h4>
                    }
                </div>
                <div className='d-flex jc-flex-end ai-center'>
                    {!channels[selectedChannel].isDirect &&
                    [{title: 'Chat', icon: 'chat-square-dots-fill'}, {title: 'Members', icon: 'people-fill'}].map( (tab, idx) =>
                        <div className={`icon-tab-option${selectedTab === idx ? '-selected':''} tooltip`}
                            onClick={() => setSelectedTab(idx)} key={idx}
                        >
                            <i className='bi bi-chat-square-dots-fill' className={`bi bi-${tab.icon}`}/>
                            <div className='tooltip-text'><h6>{tab.title}</h6></div>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedTab === 0 ? 
                <div>
                    <div className='messages-container' id='messages-container' style={{height: messagesHeight}} >
                        {messages.filter(m => m.channelKey === selectedChannel).map( (m, idx) =>
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
                <div style={{height: messagesHeight, overflow: 'scroll', padding: '10px 20px'}}>
                    {users.map( (u, idx) => 
                        <div key={idx} className='d-flex jc-space-between ai-center' style={{margin: '10px 0px'}}>
                            <div className='d-flex jc-flex-start ai-center'>
                                <img src={u.iconURL} className='user-icon-small mr-10' />
                                <p>{u.displayName}</p>
                            </div>
                            {u._id !== thisUser._id &&
                                <div className='tooltip' onClick={() => handleClickDirectMessage(u)}>
                                    <i className='bi bi-chat-right-text icon-btn-circle' />
                                    <div className='tooltip-text'>
                                        <h5>Message {u.displayName} privately</h5>
                                    </div>
                                </div> 
                            }
                            
                        </div>
                    )}
                </div>
            }    
        </div>
    )
}