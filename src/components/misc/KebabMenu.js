import React, {useState} from 'react'

export default function KebabMenu(props) {
    const [backgroundColor, setBackgroundColor] = useState('transparent')

    const style={
        backgroundColor: props.backgroundColor,
        width: '5px', height: '5px',
        borderRadius: '50%'
    }

    return (
        <div className='d-flex jc-center ai-center'
            style={{
                flexDirection: 'column', gap: '3px', cursor: 'pointer',
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: backgroundColor
            }}
            onClick={props.onClick}
            onMouseOver={() => setBackgroundColor('var(--bgc-hover)')}
            onMouseLeave={() => setBackgroundColor('transparent')}
        >
            <div style={style}></div>
            <div style={style}></div>
            <div style={style}></div>
        </div>
    )
}