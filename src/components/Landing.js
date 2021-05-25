import React from "react"
import LandingHeader from "./headers/LandingHeader";
import { useHistory } from 'react-router-dom'

export default function Landing() {
    const history = useHistory()

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div style={{minHeight: '200vh'}}>
            <LandingHeader />
            <div className='landing-container'>
                <div>
                    <h1>Ergsync helps you train better</h1>
                    <br /><br />
                    <h3 className='c-cs fw-xs'>
                        Improve the quality of your training with Ergsync.
                        Whether you row on your own or in a club, we're committed to
                        helping you become a better rower.

                    </h3>
                    <br /><br /><br />
                    <button className='solid-btn' onClick={handleClickSignUp}>Get started</button>
                </div>
                <div>

                </div>
               
                
            </div>
            <div className='main-container'>
                <br /><br />
                <h1 className='fw-m'></h1>
            </div>
        </div>
    );
}