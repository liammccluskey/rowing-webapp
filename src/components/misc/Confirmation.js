import React, {useState, useEffect} from 'react'
import Pending from './Pending'

export default function Confirmation(props) {
    const [hidden, setHidden] = useState(true)
    const [pendingConfirmation, setPendingConfirmation] = useState(false)

    useEffect(() => {
        setHidden(props.hidden)
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
        <div  className='d-flex jc-center ai-center fullscreen-blur' style={{ display: hidden && 'none'}}
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
                    <div className='d-flex jc-flex-end'>
                        <button className='clear-btn-cancel' onClick={() => props.setHidden(true)}>Cancel</button>
                        <button style={{marginLeft: 15}} className='solid-btn-secondary'
                            onClick={handleClickConfirm}
                        >Yes</button>
                    </div>
                </div>
                
            </div>

        </div>
    )
}