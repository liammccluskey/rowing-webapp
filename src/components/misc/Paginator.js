import React, {useState, useEffect} from 'react'

export default function Paginator(props) {
    const pageSize = 15 // assumed unchanging default
    const [currPage, setCurrPage] = useState()
    const [pageCount, setPageCount] = useState()

    useEffect(() => {
        setCurrPage(props.currPage)
        setPageCount(Math.ceil(props.resultsCount/pageSize))
    }, [props])

    const itemStyle={
        border: '1px solid var(--tint-color-translucent)',
        borderRadius: 3,
        padding: '10px 10px',
        backgroundColor: 'var(--bgc-hover)',
        textAlign: 'center',
        color: 'var(--tint-color)'
    }

    const arrowStyle= {
        fontWeight: 700,
        fontSize: 20
    }

    function onClickPrevious() {
        if (currPage === 1) {return}
        props.onClickPrevious()
    }

    function onClickNext() {
        if (currPage === pageCount) {return}
        props.onClickNext()
    }

    return (
        <div className='d-flex jc-center' style={{gap: 15}}>
            <button className='clear-btn-secondary' onClick={onClickPrevious} disabled={currPage === 1}>
                <i className='bi bi-arrow-left' style={arrowStyle}/>
            </button>
            
            <div style={{...itemStyle, width: 100}} className='d-flex jc-space-around ai-center'>
                <h4>{currPage}</h4>
                <h5>of</h5>
                <h4>{pageCount}</h4>
            </div>

            <button className='clear-btn-secondary' onClick={onClickNext} disabled={currPage === pageCount}>
                <i className='bi bi-arrow-right' style={arrowStyle}/>
            </button>
        </div>
    )
}