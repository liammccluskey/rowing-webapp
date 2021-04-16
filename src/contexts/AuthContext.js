import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router-dom'
import { auth } from "../firebase"
import firebase from "firebase/app"
import "firebase/auth"
import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const history = useHistory()
    const [currentUser, setCurrentUser] = useState()
    const [thisUser, setThisUser] = useState()
    const [loading, setLoading] = useState(true)

    function signUp(displayName, email, password) {
    // Description: Standard register with email
        
        return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {userCredential.user.updateProfile({displayName: displayName})})
    }

    function continueWithGoogle() {
    // Description: Sign (In \ Up) with google pop up
        const provider = new firebase.auth.GoogleAuthProvider()
        return auth.signInWithRedirect(provider)
    }

    function signIn(email, password) {
    // Description: Standard sign in with email/password
        return auth.signInWithEmailAndPassword(email, password)
    }

    function signOut() {
        return auth.signOut()
    }

    async function postUser(user) {
        try {
            await api.post('/users', {
                displayName: user.displayName,
                uid: user.uid,
                iconURL: user.photoURL
            })
        } catch (error) { console.log(error) }
    }

    async function __fetchThisUser(user) {
        try {
            const res = await api.get(`/users/uid/${user.uid}`)
            if (!res.data) {
                await postUser(user)
                await __fetchThisUser(user)
                return
            } else if (res.data && !res.data.iconURL && user.photoURL) {
                api.patch(`/users/${res.data._id}/iconURL`, {iconURL: user.photoURL})
            }
            setThisUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchThisUser() {
        if (! currentUser) {return}
        __fetchThisUser(currentUser)
    }

    useEffect(() => {
    // Description: Register authState Listener on mount
        const unsubscribe = auth.onAuthStateChanged( async (user) => {
            setCurrentUser(user)
            if (user) {
                await __fetchThisUser(user)
                const currentPath = window.location.pathname
                if (currentPath.includes('login') || currentPath.includes('register')) {
                    history.push('/dashboard')
                }
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser, setCurrentUser,
        thisUser, fetchThisUser,
        signUp,
        continueWithGoogle,
        signIn,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}