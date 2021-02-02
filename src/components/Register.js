import React, { useState, useRef } from "react"
import SignHeader from "./headers/SignHeader";
import { useAuth } from "../contexts/AuthContext"
import {useHistory} from "react-router-dom"

export default function Register() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const {signUp, continueWithGoogle} = useAuth()
    const [error, setError] = useState('')
    const [awaitingResponse, setAwaitingResponse] = useState(false) 
    const history = useHistory()


    async function handleSubmit (e) {
        e.preventDefault()
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            console.log("Passwords must match")
            return
        }
        try {
            setAwaitingResponse(true)
            await signUp(emailRef.current.value, passwordRef.current.value)
            history.push('/dashboard')
        } catch (e) {
            window.alert(e.message)
        }
        setAwaitingResponse(false)
    }

    async function handleContinueWithGoogle() {
        try {
            await continueWithGoogle()
            history.push('/dashboard')
        } catch (e) {
            window.alert(e.message)
        }
    }

    return (
        <div>
            <SignHeader />
            <form onSubmit={handleSubmit}>
                <label>Email
                    <input ref={emailRef} type="email" required/>
                </label>
                <label>Password
                    <input ref={passwordRef} type="password" required/>
                </label>
                <label>Confirm Password
                    <input ref={confirmPasswordRef} type="password"></input>
                </label>
                <input disabled={awaitingResponse} type="submit"/>
            </form>
            <br />
            <button onClick={handleContinueWithGoogle}>Continue with Google</button>
            <h1>This is the registration page</h1>
        </div>
    );
}