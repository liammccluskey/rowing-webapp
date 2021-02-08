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
    //const companyImgURL = 'https://storage.pixteller.com/editor_icons/fishing/0804109543.svg'
    //const companyImgURL = 'https://storage.pixteller.com/editor_icons/outdoor-activities/5126958994.svg'
    const companyImgURL = 'https://storage.pixteller.com/designs/designs-images/2021-02-08/08/boat-bloack-1-60217f6dd4f72.png'
    const value = {
        isDarkMode, setIsDarkMode,
        companyName, companyImgURL
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