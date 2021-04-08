import React, {useState, useEffect} from 'react'

export default function Confirmation(props) {
    const [hidden, setHidden] = useState(props.hidden)

    useEffect(() => {
        setHidden(props.hidden)
    }, [props.hidden])

    const sectionStyle = {padding: '20px 30px', borderLeft: '3px solid var(--tint-color)', textAlign: 'left'}

    return (
        <div  className='d-flex jc-center ai-center'
            style={{
                height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0,
                backdropFilter: 'blur(7px)', display: hidden && 'none',
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
                    <i className='bi bi-check-circle' style={{fontSize: 20, marginRight: 10}} />
                    <h5 className='tt-u lc-2 c-tc fw-m'>{props.title}</h5>
                </div>
                
                <div style={{...sectionStyle}}>
                    <h4>{props.message}</h4>
                    <br />
                    <div className='d-flex jc-flex-end ai-center'>
                        <button className='clear-btn-secondary' onClick={() => props.setHidden(true)}>Cancel</button>
                        <button style={{marginLeft: 15}} className='solid-btn-secondary'
                            onClick={props.handleClickConfirm}
                        >Yes</button>
                    </div>
                </div>
                
            </div>

        </div>
    )
}