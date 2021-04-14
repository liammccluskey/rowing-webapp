import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"

export default function SignHeader() {
    const history = useHistory()

    return (
        <div className='main-header d-flex jc-flex-start ai-center'>
            <h3 onClick={() => history.push('/')} className='logo-text'>{process.env.REACT_APP_COMPANY_NAME}</h3>
        </div>

    );
}