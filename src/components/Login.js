import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useMessage } from '../contexts/MessageContext'
import SignHeader from './headers/SignHeader'
import moment from 'moment'

export default function Login() {
    const { setMessage } = useMessage()
    const emailRef = useRef()
    const passwordRef = useRef()
    const {signIn, continueWithGoogle } = useAuth()
    const history = useHistory()
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setAwaitingResponse(true)
            await signIn(emailRef.current.value, passwordRef.current.value)
        } catch (e) {
            setMessage({title: e.message, isError: true, timestamp: moment()})
            setAwaitingResponse(false)
        }
    }

    async function handleContinueWithGoogle() {
        try {
            await continueWithGoogle()
        } catch(e) {
            setMessage({title: e.message, isError: true, timestamp: moment()})
        }
    }

    function handleClickSignUp() {
        history.push('/register')
    }

    function handleClickForgotPassword() {
        history.push('/reset')
    }

    return (
        <div className='login-page'>
            <SignHeader />
            <br />
            <div className='float-container login-card'>
                <form onSubmit={handleSubmit}>
                    <h3>Sign in to your account</h3>
                    <br /><br />
                    <label>Email <br />
                        <input ref={emailRef} type="email" name="email" id="email" required/>
                    </label>
                    <br /><br />
                    <label>Password <br />
                        <input ref={passwordRef}  type="password" name="password" id="password" required/>
                    </label>
                    <br />
                    <p className='action-link' onClick={handleClickForgotPassword}>Forgot password?</p>
                    <br /><br /><br />
                    <button className='solid-btn-secondary' type="submit">Log In</button>
                    <br /><br />
                </form>
                <h4 className='d-flex jc-center'>or</h4>
                <br />
                <button className='clear-btn-secondary' disabled={awaitingResponse} onClick={handleContinueWithGoogle} >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        height='18px' width='18px'
                    />
                    Continue with Google
                </button>
            </div>

            <div className='d-flex jc-center' style={{marginTop: 10}}>
                <p style={{marginRight: 10}}>Don't have an account?</p>
                <p className='action-link' onClick={handleClickSignUp}>Sign up</p>
            </div>

            <div className='login-spacer'></div>
        </div>
        
    );
}