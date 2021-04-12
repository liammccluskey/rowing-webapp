import React, { useRef, useState } from "react"
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

    const inputStyle = {
        width: '400px'
    }

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
            continueWithGoogle()
            .then(history.push('/dashboard'))
        } catch(e) {
            window.alert('Login Page: ' + e.message)
        }
    }


    return (
        <div className='d-flex jc-flex-start ai-center'style={{backgroundColor: 'var(--bgc)', height: '100vh'}}>
            <div style={{ textAlign: 'left', padding: '0px 50px'}}>
                <form onSubmit={handleSubmit}>
                    <h2>Welcome to {process.env.REACT_APP_COMPANY_NAME}</h2>
                    <br />
                    <label>Email <br />
                        <input ref={emailRef} style={inputStyle}type="email" name="email" id="email" required/>
                    </label>
                    <br /><br />
                    <label>Password <br />
                        <input ref={passwordRef} style={inputStyle} type="password" name="password" id="password" required/>
                    </label>
                    <br /><br /><br /><br />
                    <button className='solid-btn' type="submit">Log In</button>
                    <br /><br />
                </form>
                <div className='d-flex' style={{flexDirection: 'column'}}>
                    <h4 style={{margin: '0px auto'}} >or</h4>
                    <br />
                    <button className='clear-btn' disabled={awaitingResponse} onClick={handleContinueWithGoogle} >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            height='18px' width='18px'
                            style={{float: 'left'}}
                        />
                        Continue with Google
                    </button>
                </div>
                
            </div>
            <img 
                style={{ flex: '1', objectFit: 'cover', objectPosition: 'left'}} height='100%'
                src='https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/Misc%2Frow-draw.png?alt=media&token=c58a9412-27ba-4aa3-b68b-2b07fe9e630c'
                src="https://i.ibb.co/N16NbtX/row-draw-fx.png"
            />
            
            <br />

        </div>
    );
}