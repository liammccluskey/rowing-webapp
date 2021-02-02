import React from "react"
import {useTheme} from "../../contexts/ThemeContext"

export default function MainHeader() {
    const {companyName} = useTheme()
    return (
        <div className="d-flex jc-flex-start main-header">
            <h2 className="ml-default">{companyName}</h2>
        </div>
    )
}