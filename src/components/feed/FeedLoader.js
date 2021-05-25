import react, {useState, useEffect} from 'react'
import Pending from '../misc/Pending'

export default function FeedLoader(props) {
    const [loading, setLoading] = useState(props.loading)
    const [canLoadMore, setCanLoadMore] = useState(props.canLoadMore)
    
    useEffect(() => {
        setLoading(props.loading)
        setCanLoadMore(props.canLoadMore)
    }, [props] )
 
    return (
        <div className='d-flex' style={{margin: '20px 0px', ...props.style}}>
            {canLoadMore ? 
            <button className='clear-btn' style={{flex: 1}} onClick={props.handleClickLoadMore}>
                {loading && <Pending style={{marginRight: 20}} /> }
                {loading ? `Loading more ${props.pluralUnit}` : `Load more ${props.pluralUnit}`}
            </button>
            :
            <div className='trans-container search-message' style={{flex: 1}}>
                {props.feedEndMessage}
            </div>
            }
        </div>
    )
}