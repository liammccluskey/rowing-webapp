import React, {useState, useEffect, useRef, useReducer} from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
import { formatNumber, formatUnit } from '../../scripts/Numbers'
import Comment from './Comment'

export default function ReplySection(props) {
    const { thisUser } = useAuth()
    const { setMessage } = useMessage()
    const history = useHistory()

    const [repliesHidden, setRepliesHidden] = useState(true)

    const [replies, setReplies] = useState([])

    useEffect(() => {
        setReplies(props.comment.hasOwnProperty('replies') ? props.comment.replies : Array(0))
    }, [props.comment])

    function handleClickViewReplies() {
        setRepliesHidden(curr => !curr)
    }

    return (
        <div>
            <div className='d-flex jc-flex-start ai-center' onClick={handleClickViewReplies}
                style={{display: replies.length === 0 && 'none', marginBottom: replies.length === 0 ? 0: 10}}
            >
                <h5 className='action-link fw-m'>
                    {repliesHidden ? 'View':'Hide'} {formatNumber(replies.length)} {formatUnit('reply', replies.length)}
                </h5>
            </div>
            <div style={{display: repliesHidden && 'none'}}>
                {replies.map( (reply, idx) => (
                    <Comment style={{padding: '5px 0px'}}
                        parentID={props.comment._id} 
                        comment={reply} 
                        fetchData={props.fetchData} 
                        isReply={true}
                    />
                ))}
            </div>
        </div>
    )
}