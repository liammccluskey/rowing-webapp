import React, { useState, useContext, useEffect } from 'react'
import { useTheme } from './ThemeContext'

const MessageContext = React.createContext()

export function useMessage() {
    return useContext(MessageContext)
}

export function MessageProvider({children}) {
    // external interface
    const [message, setMessage] = useState(null)
    const value = {message, setMessage}
    // internal interface
    const [messages, setMessages] = useState([])
    const [messageTimestamps, setMessageTimestamps] = useState(new Set())

    useEffect(() => {
        if (message === null) {return}
        const key = messages.length + 1
        if (! messageTimestamps.has(message.timestamp.format())) {
            setMessages([...messages, {...message, isHidden: false, key: key} ])
            setMessageTimestamps(curr => (new Set([...curr, message.timestamp.format()])) )
            setTimeout(() => hideMessage(key), 5*1000);
        }
        
    }, [message])

    function hideMessage(messageKey) {
        setMessages(messages => ([...
            messages.map( message => {
                if (message.key === messageKey && !message.isHidden) {
                    return {...message, isHidden: true}
                } else {
                    return message
                }
            })
        ]))
    }

    const messageWidth = 400 + 4
    const messageHeight = 50 + 4
    const xWidth = 40

    return (
        <MessageContext.Provider value={value}>
            {children}
            <div style={{position: 'fixed', left: '50%', marginLeft: -messageWidth/2, bottom: 100, width: messageWidth, textAlign: 'left'}}>
                {messages !== null && messages.map((message, idx) => (
                    <div key={idx} className='d-flex jc-flex-start float-container' 
                        style={{
                            overflow: 'hidden', gap: 0, border: message.isError ? '2px solid var(--color-error)' : '2px solid var(--tint-color)',
                            marginTop: 10, display: message.isHidden && 'none'
                        }}
                        hidden={message.isHidden}
                    >
                        <div  onClick={() => hideMessage(message.key)}
                            style={{
                                width: xWidth,
                                backgroundColor: message.isError ? 'var(--color-error)' : 'var(--tint-color)',
                                cursor: 'pointer'
                            }}
                            className='d-flex ai-center jc-center onhover-dark'
                        >
                            <i className='bi bi-x' style={{fontSize: 30, color: 'white'}} />
                        </div>
                        <div style={{padding: '10px 10px'}}>
                            {message.isError &&
                                <div className='d-flex jc-flex-start ai-center mb-5'>
                                    <i className='bi bi-exclamation-circle mr-10' style={{color: 'var(--color-error)', fontSize: 15}} />
                                    <h4 style={{color: 'var(--color-error)'}}>
                                        Something went wrong
                                    </h4>
                                </div>
                            }
                            <h4>{message.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </MessageContext.Provider>
        
    )
}