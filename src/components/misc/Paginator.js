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
        border: '1px solid var(--tint-color)',
        borderRadius: 3,
        textAlign: 'center',
    }

    const arrowStyle= {
        fontSize: 20,
        padding: '8px 15px',
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
        <div className='d-flex jc-center ai-center' style={{ display: props.resultsCount === 0 && 'none'}}>
           
            <div style={itemStyle} className='d-flex jc-space-around ai-center'>
                <i className='bi bi-chevron-left paginator-button mr-20' style={arrowStyle} onClick={onClickPrevious}/>
                <h4 className='mr-20'>{currPage}</h4>
                <h5 className='mr-20'>of</h5>
                <h4 className='mr-20'>{pageCount}</h4>
                <i className='bi bi-chevron-right paginator-button' style={arrowStyle} onClick={onClickNext}/>
            </div>

        </div>
    )
}