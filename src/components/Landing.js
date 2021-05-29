import React, {useState} from "react"
import LandingHeader from "./headers/LandingHeader";
import { useHistory } from 'react-router-dom'

const src_dashboard = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fdashboard_page.png?alt=media&token=11d6adb2-1f37-41c1-9b7a-ec75b9d44129'
const src_session = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fsession_page.png?alt=media&token=4ddffe42-46f8-4894-b3f7-c4c0e0286c97'
const src_statistics = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fstats_page.png?alt=media&token=677c4680-1e32-4f0f-9c15-9df73ec3a4b0'
const src_club_profile = ''

export default function Landing() {
    const history = useHistory()

    const [selectedTab, setSelectedTab] = useState(0)
    const heroTabs = [
        {src: src_dashboard, title: 'Main Dashboard'},
        {src: src_session, title: 'Live Workout'},
        {src: src_statistics, title: 'Athlete Statistics'}
    ]

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div style={{minHeight: '100vh'}} className='landing-page'>
            <LandingHeader />
            <div className='landing-container' >
                <div>
                    <h1>The ultimate training platform for rowers</h1>
                    <br /><br />
                    <h3 className='fw-s c-c' style={{lineHeight: '150%'}}>
                        With Ergsync you can join live group workouts, easily track 
                        your progress over time, and join a growing community of other rowers. 
                    </h3>
                    <br /><br />
                    <button className='solid-btn' onClick={handleClickSignUp}>Get started</button>
                </div>
                <img src={heroTabs[selectedTab].src} style={{width: '100%', boxShadow: 'var(--box-shadow-dark)', borderRadius: 5}} />
                <div></div>
                <div className='d-flex jc-space-between ai-center'>
                    {heroTabs.map( (tab, idx) => 
                        <h4 className={idx === selectedTab ? 'menu-option-active' : 'menu-option'} key={idx}
                            onClick={() => setSelectedTab(idx)}
                        >
                            {tab.title}
                        </h4>
                    )}
                </div>
                <div></div>
               
                
            </div>
        </div>
    );
}