import React, { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useMessage } from '../contexts/MessageContext'
import SignHeader from './headers/SignHeader'
import moment from 'moment'
import firebase from "firebase/app"
import "firebase/auth"

export default function PasswordReset() {
    const { setMessage } = useMessage()
    const emailRef = useRef()
    const passwordRef = useRef()
    const {signIn, continueWithGoogle } = useAuth()
    const history = useHistory()
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await firebase.auth().sendPasswordResetEmail(emailRef.current.value)
            setMessage({title: 'Check your email for a reset password link.', isError: false, timestamp: moment()})
        } catch (error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
        }
    }

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div style={{ height: '100vh'}}>
            <SignHeader />
            <br />
            <div className='float-container login-card'>
                <form onSubmit={handleSubmit}>
                    <h3>Reset your password</h3>
                    <br /><br />
                    <p className='c-cs'>
                        Enter the email address associated with your account and we'll send you a link to reset your password.
                    </p>
                    <br /><br />
                    <label>Email <br />
                        <input ref={emailRef} type="email" name="email" id="email" required/>
                    </label>
                    <br /><br /><br />
                    <button className='solid-btn-secondary' type="submit">Continue</button>
                    <br /><br />
                </form>
            </div>

            <div className='d-flex jc-center' style={{marginTop: 10}}>
                <p style={{marginRight: 10}}>Don't have an account?</p>
                <p className='action-link' onClick={handleClickSignUp}>Sign up</p>
            </div>
            <div className='login-spacer'></div>
        </div>
        
    );
}