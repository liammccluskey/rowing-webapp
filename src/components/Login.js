import React, { useEffect, useRef, useState } from "react"
import SignHeader from "./headers/SignHeader";
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase"
import { useHistory, Redirect } from "react-router-dom"
import firebase from "firebase/app"
import "firebase/auth"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { currentUser, setCurrentUser, signIn, continueWithGoogle } = useAuth()
    const history = useHistory()
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setAwaitingResponse(true)
            await signIn(emailRef.current.value, passwordRef.current.value)
            history.push('/dashboard')
        } catch (e) {
            window.alert(e.message)
            setAwaitingResponse(false)
        }
    }

    async function handleContinueWithGoogle() {
        try {
            await continueWithGoogle()
            history.push('/dashboard')
        } catch(e) {
            window.alert(e.message)
        }
    }


    return (
        <div>
            <SignHeader />
            <form onSubmit={handleSubmit}>
                <label>Email
                    <input ref={emailRef} type="email" name="email" id="email" required/>
                </label>
                <label>Password
                    <input ref={passwordRef} type="password" name="password" id="password" required/>
                </label>
                <input type="submit"/>
            </form>
            <br />
            <button disabled={awaitingResponse} onClick={handleContinueWithGoogle} >Continue with Google</button>
            <h1>This is the login page</h1>
        </div>
    );
}