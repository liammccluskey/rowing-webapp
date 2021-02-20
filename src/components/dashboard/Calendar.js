import React from 'react'

export default function Calendar(props) {

    const months = [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ]

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns:'repeat(4,1fr)',
            gridAutoRows: '150px',
            }}
            className='float-container'
        >
            {months.map((month, index) => (
                <div key={index} 
                    style={{padding: '10px 10px', border: '1px solid var(--bgc)', borderRadius: '0px'}}
                >
                    <p style={{color: 'var(--color-secondary)', textTransform: 'uppercase'}}>{month}</p>
                </div>
            ))}
        </div>
    )
}