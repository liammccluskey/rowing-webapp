import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"

export default function SignHeader() {
    const history = useHistory()

    return (
        <div className='landing-header d-flex jc-flex-start ai-center'>
            <div className='d-flex jc-flex-start ai-center' onClick={() => history.push('/')} style={{cursor: 'pointer'}}> 
                <img src='/images/logo-0.png' height={35} width={35} className='mr-10' style={{borderRadius: '50%'}} />
                <h2 className='logo-text' 
                    style={{marginRight: 40}}
                >
                    {process.env.REACT_APP_COMPANY_NAME}
                </h2>
            </div>
        </div>

    );
}