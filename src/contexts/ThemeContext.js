import React, {useState, useContext, useEffect} from "react"

/*
    Items contained in ThemeContext:
        - company name
        - dark/light mode
        - ...
*/

const ThemeContext = React.createContext() 

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({children}) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const companyName = "Rowe"
    const value = {
        isDarkMode, setIsDarkMode,
        companyName
    }

    useEffect(() => {
        // TEST
        console.log("themecontext: updated theme")
        console.log(isDarkMode ? "themecontext: new theme is dark" : "themecontext: new theme is light" )

    }, [isDarkMode])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}