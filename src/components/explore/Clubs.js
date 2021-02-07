import React from 'react'
import ExploreHeader from './ExploreHeader'
import MainHeader from '../headers/MainHeader'


export default function Clubs() {

    return (
        <div>
            <MainHeader />
            <ExploreHeader subPath='/clubs' />
            <h1>Clubs</h1>
        </div>
        
    )
}