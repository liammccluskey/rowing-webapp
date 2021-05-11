import React from "react"
import {useHistory} from "react-router-dom";



export default function LandingHeader() {
    const history = useHistory()

    function handleClickSignIn() {
        history.push('/login')
    }

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div className='landing-header d-flex jc-space-between ai-center'>
            <div className='d-flex jc-flex-start ai-center' onClick={() => history.push('/')} style={{cursor: 'pointer'}}> 
                <img src='/images/logo-0.png' height={35} width={35} className='mr-10' style={{borderRadius: '50%'}} />
                <h3 className='logo-text' 
                    style={{marginRight: 40}}
                >
                    {process.env.REACT_APP_COMPANY_NAME}
                </h3>
            </div>
            <div className='d-flex jc-center ai-center'>
                <button onClick={handleClickSignIn}style={{marginRight: 20}} className='clear-btn fw-m'>Log In</button>
                <button onClick={handleClickSignUp} className='solid-btn fw-m'>Sign Up</button>
            </div>
        </div>

    )
}