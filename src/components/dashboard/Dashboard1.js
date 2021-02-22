import React from 'react'

export default function Dashboard1() {
    const textStyle={
        color: 'rgba(255,255,255,0.7)',
        fontSize: '17px'
    }
    const links = [
        'dashboard',

    ]
    return (
        <div className='d-flex jc-flex-start'>
            <div style={{backgroundColor: 'var(--bgc)'}}>
                <div 
                    style={{
                        height: '100vh', width: '200px',
                        backgroundColor: 'var(--tint-color)',
                        padding: '20px 20px'
                    }}
                    className='sidebar'
                >
                    <div className='d-flex jc-center ai-center' style={{gap: '20px'}}>
                        <img height='30px' width='30px' src={process.env.REACT_APP_COMPANY_ICON_URL} />
                        <h3 style={textStyle}>ROWE</h3>
                    </div>
                    {['Dashboard', 'Explore', 'Clubs', 'Account', 'Settings'].map(navItem => (
                        <div style={{textAlign: 'left'}}>
                            <p style={textStyle}>{navItem}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}