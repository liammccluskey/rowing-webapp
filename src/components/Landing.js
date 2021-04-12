import React from "react"
import LandingHeader from "./headers/LandingHeader";

export default function Landing() {
    return (
        <div style={{minHeight: '100vh'}}>
            <LandingHeader />
            <h1>This is the landing page</h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="var(--color-twitter-blue)" fillOpacity="1" d="M0,32L30,80C60,128,120,224,180,224C240,224,300,128,360,117.3C420,107,480,181,540,202.7C600,224,660,192,720,165.3C780,139,840,117,900,133.3C960,149,1020,203,1080,208C1140,213,1200,171,1260,160C1320,149,1380,171,1410,181.3L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
        </div>
    );
}