import React from 'react'
import SubHeader from '../headers/SubHeader'

export default function TrainingHeader(props) {
    const items = [
        {title: 'Statistics', path: '/statistics'},
        {title: 'Activity', path: '/activity'}
    ]

    return (
        <SubHeader
            title='Training'
            path='/training'
            items = {items}
            subPath={props.subPath}
        />
    )
}