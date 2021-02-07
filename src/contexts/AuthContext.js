import React, { useEffect, useState, useContext } from "react"
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
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function createUser(authResult, displayName) {
        // Init user data in MongoDB after created in firebase
        try {
            const res = await api.post('/users', {
                displayName: displayName,
                firebaseUID: authResult.user.uid
            })
            // Did update user, store ._id in fb.auth.user.photoURL
            if (res.data._id) {
                await authResult.user.updateProfile({
                    photoURL: res.data._id
                })
            }
        } catch(error) { console.log(error) }
    }


    function signUp(displayName, email, password) {
    // Description: Standard register with email
        return auth.createUserWithEmailAndPassword(email, password)
        .then( (userCredential) => createUser(userCredential, displayName) )
    }

    function continueWithGoogle() {
    // Description: Sign (In \ Up) with google pop up
        const provider = new firebase.auth.GoogleAuthProvider()
        return auth.signInWithPopup(provider)
        .then( (userCredential) => createUser(userCredential, userCredential.user.displayName))
    }

    function signIn(email, password) {
    // Description: Standard sign in with email/password
        return auth.signInWithEmailAndPassword(email, password)
    }

    function signOut() {
        return auth.signOut()
    }

    useEffect(() => {
    // Description: Register authState Listener on mount
        console.log("Mounted authcontext")
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser, setCurrentUser,
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