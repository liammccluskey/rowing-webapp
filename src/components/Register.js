import React, { useState, useRef } from "react"
import SignHeader from "./headers/SignHeader"
import { useAuth } from "../contexts/AuthContext"
import {useHistory} from "react-router-dom"
import { useMessage } from '../contexts/MessageContext'
import moment from 'moment'

export default function Register() {
    const history = useHistory()
    const { setMessage } = useMessage()

    const emailRef = useRef()
    const passwordRef = useRef()
    const nameRef = useRef()
    const {signUp, continueWithGoogle} = useAuth()
    const [awaitingResponse, setAwaitingResponse] = useState(false) 


    async function handleSubmit (e) {
        e.preventDefault()
        try {
            setAwaitingResponse(true)
            await signUp(nameRef.current.value, emailRef.current.value, passwordRef.current.value)
        } catch (error) {
            setMessage({title: error.message, isError: true, timestamp: moment()})
            setAwaitingResponse(false)
        }
    }

    async function handleContinueWithGoogle() {
        try {
            await continueWithGoogle()
        } catch (e) {
            window.alert(e.message)
        }
    }

    function handleClickSignIn() {
        history.push('/login')
    }

    return (
        <div>
            <SignHeader />
            <br /><br />
            <div className='float-container login-card'>
                <form onSubmit={handleSubmit}>
                    <h3>Create your account</h3>
                    <br /><br />
                    <label>Email <br />
                        <input ref={emailRef} type="email" name="email" id="email" required/>
                    </label>
                    <br /><br />
                    <label>Full name <br />
                        <input ref={nameRef} type='text' required />
                    </label>
                    <br /><br />
                    <label>Password <br />
                        <input ref={passwordRef}  type="password" name="password" id="password" required/>
                    </label>
                    <br />
                    <br /><br /><br />
                    <button className='solid-btn-secondary' type="submit">Create account</button>
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
                <p style={{marginRight: 10}}>Already have an account?</p>
                <p className='action-link' onClick={handleClickSignIn}>Sign in</p>
            </div>
            
        </div>
    );
}