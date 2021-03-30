import React, {useState, useContext, useEffect} from "react"
import {useAuth} from './AuthContext'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

const ThemeContext = React.createContext() 

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({children}) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [tintColor, setTintColor] = useState(0)
    const [loading, setLoading] = useState(true)
    const {currentUser} = useAuth()
    const companyName = "Rowe"
    const domainURL = 'https://rowe.com/clubs/'

    const value = {
        isDarkMode, setIsDarkMode,
        companyName, domainURL
    }

    const cssVars = [
        '--bgc-nav',
        '--bgc',
        '--bgc-hover',
        '--bgc-light',
        '--bgc-settings',
        '--bc',
        '--bc-tr',
        '--color',
        '--color-header',
        '--color-secondary',
        '--color-tertiary',
        '--box-shadow',
        '--box-shadow-dark',
        '--float-border'
    ]

    useEffect(() => {
        async function fetchData() {
            setLoading(false) // this is wrong, fix it
            try {
                const res = await api.get(`/users/${currentUser.uid}`)
                setIsDarkMode(res.data.usesDarkMode)
                console.log('user data')
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchData()
    }, [])

    useEffect(() => {
        let extension = isDarkMode ? '-d' : '-l'
        let root = document.documentElement;

        cssVars.forEach(name => {
            root.style.setProperty(name, `var(${name}${extension})`)
        })

        async function updateData() {
            try {
                await api.patch(`/users/${currentUser.uid}/color-theme`, {
                    usesDarkMode: isDarkMode
                })
            } catch (error) {
                console.log(error)
            }
        }
        updateData()

    }, [isDarkMode])

    return (
        <ThemeContext.Provider value={value}>
            {!loading && children}
        </ThemeContext.Provider>
    )
}