import React from 'react'
import MainHeader from '../headers/MainHeader'
import ExploreHeader from './ExploreHeader'

export default function Sessions() {
    
    return (
        <div>
            <MainHeader />
            <ExploreHeader subPath='/sessions' />
            <h1>Sessions</h1>
        </div>
    )
}