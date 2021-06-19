import React, {useState, useEffect} from "react"
import LandingHeader from "./headers/LandingHeader";
import { useHistory } from 'react-router-dom'
import {useTheme} from '../contexts/ThemeContext'

const src_dashboard = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fpage_dashboard.png?alt=media&token=4d67f572-a683-480f-8dd6-18014b18a8d7'
const src_session = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fpage_live_workout.png?alt=media&token=70323e96-b111-4025-a627-a0332b13cbd6'
const src_statistics = 'https://firebasestorage.googleapis.com/v0/b/rowing-a06ba.appspot.com/o/landing%2Fpage_athlete_stats.png?alt=media&token=9a2336dc-9f1b-4d63-81f0-b772f71620a4'

export default function Landing() {
    const history = useHistory()
    const {setThemeColor, setTintColor} = useTheme()

    const [selectedTab, setSelectedTab] = useState(1)
    const heroTabs = [
        {src: src_dashboard, title: 'Dashboard'},
        {src: src_session, title: 'Live Workout'},
        {src: src_statistics, title: 'Athlete Statistics'}
    ]

    useEffect(() => {
        setThemeColor(0) // light mode
        setTintColor(3)
    }, [])

    function handleClickSignUp() {
        history.push('/register')
    }

    return (
        <div style={{minHeight: '100vh'}} className='landing-page'>
            <LandingHeader />
            <div className='landing-container-12 landing-hero-section' >
                <div>
                    <h1 className='fw-m'>The ultimate training platform for rowers</h1>
                    <br /><br />
                    <h3 className='fw-s c-c' style={{lineHeight: '150%'}}>
                        With Ergsync you can join live group workouts, easily track 
                        your progress over time, and join a growing community of other rowers.
                        Just connect your Concept2 RowErg to get started. 
                    </h3>
                    <br /><br />
                    <button className='solid-btn cta-button'  onClick={handleClickSignUp}>Get started free</button>
                </div>
                <img src={heroTabs[selectedTab].src} style={{width: '100%',  borderRadius: 5, border: '10px solid var(--bc)'}} />
                <div></div>
                <div className='d-flex jc-space-between ai-center'>
                    {heroTabs.map( (tab, idx) => 
                        <h3 className={idx === selectedTab ? 'landing-tab-option-selected' : 'landing-tab-option'} key={idx}
                            onClick={() => setSelectedTab(idx)}
                        >
                            {tab.title}
                        </h3>
                    )}
                </div>
            </div>
            <div className='landing-container-11 landing-how-section'>
                <div>
                    <h1 className='fw-l mb-15' style={{color: 'black'}}>How it works</h1>
                    <h3 className='fw-s c-cs mb-15'>
                        Whether you're a rowing coach or an athlete, you can improve your training
                        with <strong>Ergsync</strong> in just a few simple steps
                    </h3>
                </div>
                <div></div>
                <div className='trans-container' style={{height: 275, padding: 30}}>
                    <h2 className='fw-l'>For Athletes</h2>
                    <br />
                    <h3 style={{lineHeight: '150%'}}>
                        To get started, all you need is a Concept2 RowErg and a computer.
                        Then just connect your ergomter to your computer via bluetooth, join a live
                        group workout, and row online with your teammates in realtime. 
                    </h3>
                </div>
                <div className='trans-container' style={{height: 275, padding: 30}}>
                    <h2 className='fw-l'>For Coaches</h2>
                    <br />
                    <h3 style={{lineHeight: '150%'}}>
                        To get started, all you need is a computer and an internet connection.
                        Once you create your team on Ergsync, you can schedule workouts, join your
                        team's live workouts and analyze their performance in realtime, and review
                        your team's results when they complete a workout.
                    </h3>
                </div>
            </div>
            <div className='landing-container-11 landing-questions-section'>
                <div>
                    <h1 className='fw-l mb-10' style={{color: 'black'}}>Questions?</h1>
                    <h3 className='c-cs mb-30'>We're here to help</h3>
                    <h3 className='mb-30'>
                        If you have any questions or suggestions for improvement, feel free to post
                        them on our subreddit
                    </h3>
                    <button className='solid-btn' onClick={() => window.open('https://www.reddit.com/r/Ergsync/')}>
                        r / Ergsync
                    </button>
                </div>

            </div>
            <div className='landing-c'></div>
            <div style={{padding: 30}}>
                <h5>© 2021 Ergsync. All rights reserved.</h5>
            </div>
        </div>
        
    );
}