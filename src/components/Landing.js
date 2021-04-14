import React from "react"
import LandingHeader from "./headers/LandingHeader";

export default function Landing() {
    return (
        <div style={{minHeight: '200vh'}}>
            <LandingHeader />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{position: 'fixed', bottom: 0, left: 0}}>
                <path fill="var(--tint-color)" fillOpacity="1" d="M0,32L80,26.7C160,21,320,11,480,21.3C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
            <div className='main-container'>
                <br /><br />
                <h1 className='fw-m'></h1>
            </div>
        </div>
    );
}