import React from "react"
import LandingHeader from "./headers/LandingHeader";
import { useHistory } from 'react-router-dom'

export default function Landing() {
    const history = useHistory()

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div style={{minHeight: '200vh'}} className='landing-page'>
            <LandingHeader />
            <div className='landing-container'>
                <div>
                    <h1>The ultimate training platform for rowers</h1>
                    <br /><br />
                    <h3 className='c-cs fw-xs'>
                        Whether you row on your own or in a club, we're committed to
                        helping you become a better rower. With Ergsync you can join 
                        live group workouts, easily track your progress over time, 
                        and join a growing community of other rowers. 

                    </h3>
                    <br /><br /><br />
                    <button className='solid-btn' onClick={handleClickSignUp}>Get started</button>
                </div>
                <div>

                </div>
               
                
            </div>
        </div>
    );
}