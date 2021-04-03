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
    const [tintColor, setTintColor] = useState(4)
    const [loading, setLoading] = useState(true)
    const {currentUser} = useAuth()
    const companyName = "Rowe"
    const domainURL = 'https://rowe.com/clubs/'

    const tintColors = [
        {name: 'Soft Blue', extension: 'strava'},    // default
        {name: 'Green', extension: 'green'},
        {name: 'Purple', extension: 'discord'},
        {name: 'Sharp Blue', extension: 'rh-blue'},
        {name: 'Twitter Blue', extension: 'twitter-blue'}
    ]

    const value = {
        isDarkMode, setIsDarkMode,
        tintColor, setTintColor, tintColors,
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
        let root = document.documentElement

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

    useEffect(() => {
        const extension = tintColors[tintColor].extension
        const root = document.documentElement

        root.style.setProperty('--tint-color', `var(--color-${extension})`)
        root.style.setProperty('--tint-color-translucent', `var(--color-translucent-${extension})`)
    }, [tintColor])

    return (
        <ThemeContext.Provider value={value}>
            {!loading && children}
        </ThemeContext.Provider>
    )
}