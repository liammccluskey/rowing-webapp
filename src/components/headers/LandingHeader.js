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
            <h3 style={{marginRight: 10}} className='logo-text'
                onClick={() => history.push('/')}
            >
                {process.env.REACT_APP_COMPANY_NAME}
            </h3>
            <div className='d-flex jc-center ai-center'>
                <button onClick={handleClickSignIn}style={{marginRight: 20}} className='clear-btn'>Log In</button>
                <button onClick={handleClickSignUp} className='solid-btn'>Sign Up</button>
            </div>
        </div>

    )
}