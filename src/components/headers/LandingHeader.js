import React from "react"
import {Link, useHistory} from "react-router-dom";



export default function LandingHeader() {
    const history = useHistory()
    return (
        <div className='landing-header'>
            <div className='d-flex jc-flex-start ai-center' style={{gap: 10, cursor: 'pointer'}}
                onClick={() => history.push('/')}
            > 
                <h2>Rowa</h2>
                <img height='30px' width='33px'
                    src={process.env.REACT_APP_COMPANY_ICON_DARK_URL}
                />
            </div>
            <Link to="/">Landing</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>

    );
}