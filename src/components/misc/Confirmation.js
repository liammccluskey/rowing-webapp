import React, {useState, useEffect} from 'react'
import Pending from './Pending'

export default function Confirmation(props) {
    const [hidden, setHidden] = useState(true)
    const [pendingConfirmation, setPendingConfirmation] = useState(false)

    useEffect(() => {
        setHidden(props.hidden)
        console.log('did change hidden')
    }, [props.hidden])

    const sectionStyle = {padding: '20px 30px', borderLeft: '3px solid var(--tint-color)', textAlign: 'left'}

    async function handleClickConfirm() {
        setPendingConfirmation(true)
        await props.handleClickConfirm()
        setTimeout(() => {
            setPendingConfirmation(false)
            props.setHidden(true)
        }, 1*1000);
        
    }

    return (
        <div  className='d-flex jc-center ai-center'
            style={{
                height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0,
                backdropFilter: 'blur(3px)', display: hidden && 'none',
                zIndex: 21
            }}
            hidden={hidden}
        >
            <div className='float-container'
                style={{width: 'min(500px, 75vw)'}}
            >
                <div style={{...sectionStyle, backgroundColor: 'var(--tint-color-translucent', color: 'var(--tint-color)'}}
                    className='d-flex jc-flex-start ai-center'
                >

                    <Pending style={{display: !pendingConfirmation && 'none', marginRight: pendingConfirmation && 10}} />
                    <i className='bi bi-check-circle' 
                        style={{display: pendingConfirmation && 'none', fontSize: 20, marginRight: !pendingConfirmation && 10}} 
                    />
                    <h5 className='tt-u lc-2 c-tc fw-m'>{pendingConfirmation ? 'Pending' : props.title}</h5>
                    
                </div>
                
                <div style={{...sectionStyle}}>
                    <h4>{props.message}</h4>
                    <br />
                    <div className='d-flex jc-flex-end ai-center'>
                        <button className='clear-btn-secondary' onClick={() => props.setHidden(true)}>Cancel</button>
                        <button style={{marginLeft: 15}} className='solid-btn-secondary'
                            onClick={handleClickConfirm}
                        >Yes</button>
                    </div>
                </div>
                
            </div>

        </div>
    )
}