import React, { useEffect, useState, useContext } from "react"
import { auth } from "../firebase"
import firebase from "firebase/app"
import "firebase/auth"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signUp(email, password) {
    // Description: Standard register with email
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function continueWithGoogle() {
    // Description: Sign (In \ Up) with google pop up
        const provider = new firebase.auth.GoogleAuthProvider()
        return auth.signInWithPopup(provider)
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