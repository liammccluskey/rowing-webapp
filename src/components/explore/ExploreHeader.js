import React from 'react'
import SubHeader from '../headers/SubHeader'


export default function ExploreHeader(props) {
    const items = [
        {title: 'Clubs', path: '/clubs'}
    ]

    return (
        <SubHeader 
            title='Explore'
            path='/explore'
            subPath={props.subPath}
            items={items}
        />
    )
}