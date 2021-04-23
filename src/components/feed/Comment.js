import React, {useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import ReplySection from './ReplySection'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
import { formatNumber, formatUnit } from '../../scripts/Numbers'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Comment(props) {
    const { thisUser } = useAuth()
    const { setMessage } = useMessage()
    const history = useHistory()

    const [comment, setComment] = useState(props.comment)

    const [isReplying, setIsReplying] = useState(false)
    const [reply, setReply] = useState('')
    const replyRef = useRef()

    useEffect(() => {
        setComment(props.comment)
    }, [props.comment])

    function handleClickUser(user) {
        history.push(`/athletes/${user._id}`)
    }

    async function handleClickReply() {
        await setIsReplying(true)
        replyRef.current.focus()
    }

    function handleClickCancelReply() {
        setIsReplying(false)
        setReply('')
    }

    async function handleSubmitReply(e) {
        e.preventDefault()
        const pID = props.isReply ? props.parentID : comment._id
        try {
            const body = {parent: pID, user: thisUser._id, message: reply}
            await api.post('/comments/reply', body)
            setMessage({title: 'Reply submitted', isError: false, timestamp: moment()})
            setReply('')
            setIsReplying(false)
            props.fetchData()
        } catch (error) {
            setMessage({title: `Error submitting reply. ${error.message}`, isError: true, timestamp: moment()})
        }
    }

    async function handleDeleteComment() {
        if (!window.confirm('Are you sure you want to delete this message?')) { return }
        const url = props.isReply ? 
            `/comments/reply?reply=${comment._id}&parent=${props.parentID}&user=${thisUser._id}`
            :
            `/comments?comment=${comment._id}&user=${thisUser._id}`
        try {
            await api.delete(url)
            setMessage({title: 'Comment deleted', isError: false, timestamp: moment()})
            props.fetchData()
        } catch (error) {
            setMessage({title: `Error deleting comment. ${error.message}`, isError: true, timestamp: moment()})
        }
    }

    return (
        <div style={props.style}>
            <div className='d-flex jc-flex-start'>
                { (!comment.removed && comment.user.iconURL) && 
                    <img src={comment.user.iconURL} className='user-icon-small' />
                }
                {(comment.removed || !comment.user.iconURL) && 
                    <div className='user-icon-default-small'>
                        <i className='bi bi-person' />
                    </div>
                }
                <div className='w-100'>
                    {comment.removed ?
                        <div className='d-inline-flex jc-flex-start ai-center mb-7'>
                            <h6 className='fw-m mr-7'>[deleted]</h6>
                            <h6 className='c-cs'>{moment(comment.createdAt).fromNow()}</h6>
                        </div>
                        :
                        <div className='d-inline-flex jc-flex-start ai-center mb-7'>
                            <h6 className='fw-m mr-7 page-link' onClick={() => handleClickUser(comment.user)}>
                                {comment.user.displayName} 
                            </h6>
                            <h6 className='c-cs'>{moment(comment.createdAt).fromNow()}</h6>
                        </div>
                    }
                    {comment.removed ? 
                        <p className='mb-5'>[comment deleted]</p>
                        :
                        <p className='mb-5'>{comment.message}</p>
                    }
                    
                    <div className='reply-icons'>
                        <div onClick={handleClickReply}>
                            <h5>Reply</h5>
                        </div>
                        {(thisUser._id === comment.user._id && !comment.removed) && 
                            <div onClick={handleDeleteComment}>
                                <h5>Delete</h5>
                            </div>
                        }
                        
                    </div>
                    <div style={{display: !isReplying && 'none'}}>
                        <div className='d-flex jc-flex-start ai-flex-start w-100' style={{marginTop: 10, marginBottom: 12}} >
                            {thisUser.iconURL && <img src={thisUser.iconURL} className='user-icon-small' />}
                            {!thisUser.iconURL && 
                                <div className='user-icon-default'>
                                    <i className='bi bi-person' />
                                </div>
                            }
                            <div className='w-100'>
                                <p className='fw-m mr-10 mb-5'>{thisUser.displayName}</p>
                                <form onSubmit={handleSubmitReply}>
                                    <textarea ref={replyRef} value={reply} onChange={e => setReply(e.target.value)} required={true}
                                        placeholder='Write a reply' rows={2} style={{resize: 'vertical', minHeight: 35}}
                                        className='mb-5 w-100 bs-bb'
                                        maxLength={500}
                                    />
                                    <div className='d-flex jc-space-between ai-center'>
                                        <button className='solid-btn-secondary' type='submit' 
                                            disabled={reply.length === 0} onClick={handleSubmitReply}
                                        >
                                            Reply
                                        </button>
                                        <button className='clear-btn-cancel' type='button' onClick={handleClickCancelReply}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {!props.isReply && <ReplySection comment={comment} fetchData={props.fetchData}/>}
                </div>
            </div>
            
        </div>
    )
}

