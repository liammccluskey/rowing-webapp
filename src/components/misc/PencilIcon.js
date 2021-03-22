import React from 'react'

export default function PencilIcon(props) {
    const border = `2px solid ${props.color}`
    const borderRadius = '2px'
    const rotation = 'rotate(45deg)'

    return (
        <div className='d-inline-flex jc-center ai-center' 
            style={{...props.style, width:40, height: 40, cursor: 'pointer', borderRadius: '50%'}}
        >
            <div style={{ transform: rotation, WebkitTransform: rotation}}>
                <div style={{
                    border: border, borderRadius: borderRadius,
                    height: '24px', width: '6px', margin: 'none'
                }}>
                    <div style={{borderBottom: border, height: '5px'}}></div>
                </div>
                <div style={{
                    height: 0, width: 0,
                    borderTop: `9px solid ${props.color}`, 
                    borderRight: '5px solid transparent', borderLeft: '5px solid transparent',
                    marginTop: -2
                }}></div>
            </div>
        </div>
        
    )
}