import React from 'react'
import MainHeader from '../headers/MainHeader'
import TrainingHeader from './TrainingHeader'

export default function Activity() {

    return (
        <div>
            <MainHeader />
            <TrainingHeader subPath='/activity' />
        </div>
    )
}