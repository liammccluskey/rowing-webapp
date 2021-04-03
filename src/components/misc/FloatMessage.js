import React, {useState, useEffect} from 'react'

/*
    props.messages = [
        {title: 'some title', isError: boolean, timestamp: moment()},
    ]
*/

export default function FloatMessage(props) {
    const [messages, setMessages] = useState([])
    const [messageTimestamps, setMessageTimestamps] = useState(new Set())

    useEffect(() => {
        const key = messages.length + 1
        if (! messageTimestamps.has(props.message.timestamp.format())) {
            setMessages([...messages, {...props.message, isHidden: false, key: key} ])
            setMessageTimestamps(curr => (new Set([...curr, props.message.timestamp.format()])) )
            setTimeout(() => hideMessage(key), 6*1000);
        }
        
    }, [props.message])

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
        
        console.log(messages)
    }

    useEffect(() => {
        console.log('did change messages')
    }, [messages])

    const messageWidth = 400 + 4
    const messageHeight = 50 + 4
    const xWidth = 40

    return (
        <div style={{position: 'fixed', left: '50%', marginLeft: -messageWidth/2, bottom: 100, width: messageWidth}}>
            {messages !== null && messages.map(message => (
                <div className='d-flex jc-flex-start float-container' 
                    style={{overflow: 'hidden', gap: 0, border: '2px solid var(--bc)', marginTop: 10, display: message.isHidden && 'none'}}
                    hidden={message.isHidden}
                >
                    <div  onClick={() => hideMessage(message.key)}
                        style={{
                            width: xWidth,
                            backgroundColor: message.isError ? 'var(--color-error)' : 'var(--tint-color)',
                            cursor: 'pointer'
                        }}
                        className='d-flex ai-center jc-center onhover-bright'
                    >
                        <i className='bi bi-x' style={{fontSize: 30, color: 'white'}} />
                    </div>
                    <h4 style={{padding: '10px 10px'}}>{message.title}</h4>
                </div>
            ))}
        </div>
    )
}