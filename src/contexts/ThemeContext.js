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

    const [isDarkMode, setIsDarkMode] = useState(thisUser ? thisUser.colorTheme === 1 : false)
    const [tintColor, setTintColor] = useState( thisUser ? thisUser.tintColor  : 0)
    const [themeColor, setThemeColor] = useState( (thisUser && thisUser.themeColor) ? thisUser.themeColor : 0 )

    const tintColors = [
        {name: 'Default Blue', extension: 'default'},   // default 
        {name: 'Green', extension: 'green'},
        {name: 'Purple', extension: 'discord'},
        {name: 'Mint', extension: 'mint'}
    ]

    const themeColors = [
        {name: 'Light Mode', extension: 'l', iconName: 'sun'},
        {name: 'Dark Mode', extension: 'd', iconName: 'moon'},
        {name: 'Blue Mode', extension: 'b', iconName: 'water'}
    ]

    const value = {
        isDarkMode, setIsDarkMode,
        tintColor, setTintColor, tintColors,
        themeColor, setThemeColor, themeColors
    }

    const cssVars = [
        '--bgc-nav',
        '--bgc',
        '--bgc-hover',
        '--bgc-light',
        '--bgc-semilight',
        '--bgc-settings',
        '--bgc-input',
        '--bc',
        '--bc-chart',
        '--color',
        '--color-header',
        '--color-secondary',
        '--color-tertiary',
        '--color-yellow-text',
        '--box-shadow',
        '--box-shadow-dark',
        '--float-border'
    ]

    useEffect(() => {
        let extension = themeColors[themeColor].extension
        let root = document.documentElement
        cssVars.forEach(name => {
            root.style.setProperty(name, `var(${name}-${extension})`)
        })

        async function updateData() {
            try {
                await api.patch(`/users/${thisUser._id}/themeColor`, {themeColor: themeColor})
            } catch (error) {
                console.log(error)
            }
        }
        if (thisUser) {updateData()}
    }, [themeColor])

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