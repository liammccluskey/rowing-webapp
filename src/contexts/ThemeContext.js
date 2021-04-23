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
    const {currentUser, thisUser, fetchThisUser} = useAuth()

    const [isDarkMode, setIsDarkMode] = useState(thisUser ? thisUser.colorTheme === '1' : false)
    const [tintColor, setTintColor] = useState( thisUser ? thisUser.tintColor  : 0)

    const tintColors = [
        {name: 'Mint', extension: 'mint'},   // default 
        {name: 'Soft Blue', extension: 'strava'},
        {name: 'Purple', extension: 'discord'},
        {name: 'Light Blue', extension: 'twitter-blue'}
    ]

    const value = {
        isDarkMode, setIsDarkMode,
        tintColor, setTintColor, tintColors
    }

    const cssVars = [
        '--bgc-nav',
        '--bgc',
        '--bgc-hover',
        '--bgc-light',
        '--bgc-settings',
        '--bgc-input',
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
        let extension = isDarkMode ? '-d' : '-l'
        let root = document.documentElement

        cssVars.forEach(name => {
            root.style.setProperty(name, `var(${name}${extension})`)
        })

        async function updateData() {
            try {
                await api.patch(`/users/${thisUser._id}/colorTheme`, {colorTheme: isDarkMode ? 1 : 0})
            } catch (error) {
                console.log(error)
            }
        }
        if (thisUser) {updateData()}
    }, [isDarkMode])

    useEffect(() => {
        const extension = tintColors[tintColor].extension
        const root = document.documentElement

        root.style.setProperty('--tint-color', `var(--color-${extension})`)
        root.style.setProperty('--tint-color-translucent', `var(--color-translucent-${extension})`)

        async function updateData() {
            try {
                await api.patch(`/users/${thisUser._id}/tintColor`, {tintColor: tintColor})
            } catch (error) {
                console.log(error)
            }
        }
        if (thisUser) { updateData() }
    }, [tintColor])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}