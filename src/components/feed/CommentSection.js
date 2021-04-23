import React, {useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import ReplySection from './ReplySection'
import Comment from './Comment'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
import { formatNumber, formatUnit } from '../../scripts/Numbers'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function CommentSection(props) {
    const { thisUser } = useAuth()
    const { setMessage } = useMessage()
    const history = useHistory()

    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true)

    const [likes, setLikes] = useState(0)
    const [loadingLikes, setLoadingLikes] = useState()
    const [didLike, setDidLike] = useState(false)

    const [comment, setComment] = useState('')
    const commentRef = useRef()

    const [commentsHidden, setCommentsHidden] = useState(true)

    useEffect(() => {
        fetchComments()
        fetchLikes()
    }, [])

    async function fetchComments() {
        try {
            const res = await api.get(`/comments/parent/${props.parentID}`)
            setComments(res.data)
        } catch (error) {
            console.log(error)
        }
        setLoadingComments(false)
    }

    async function fetchLikes() {
        try {
            const res = await api.get(`/likes/parent/${props.parentID}?user=${thisUser._id}`)
            setLikes(res.data.count)
            setDidLike(res.data.didLike)
        } catch (error) {
            console.log(error)
        }
        setLoadingLikes(false)
    }

    function handleClickUser(user) {
        history.push(`/athletes/${user._id}`)
    }

    async function handleClickLike() {
        async function submitLike() {
            try {
                await api.post('/likes', {user: thisUser._id, parent: props.parentID})
                setMessage({title: 'Like submitted', isError: false, timestamp: moment()})
                setDidLike(true)
            } catch (error) {
                setMessage({title: `Error submitting like. ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        async function submitUnlike() {
            try {
                await api.delete(`/likes?user=${thisUser._id}&parent=${props.parentID}`)
                setMessage({title: 'Unlike submitted', isError: false, timestamp: moment()})
                setDidLike(false)
            } catch (error) {
                setMessage({title: `Error submitting unlike. ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        if (loadingLikes) {
            return
        } else if (didLike) { 
            await submitUnlike()
            fetchLikes()
        } else {
            await submitLike()
            fetchLikes()
        }
    }

    async function handleClickComment() {
        await setCommentsHidden((false))
        commentRef.current.focus()
    }

    async function handleSubmitComment(e) {
        e.preventDefault()
        if (!comment.length) {return}
        try {
            const body = {parent: props.parentID, user: thisUser._id, message: comment}
            await api.post('/comments', body)
            setMessage({title: 'Your comment was saved', isError: false, timestamp: moment()})
            fetchComments()
            setComment('')
        } catch (error) {
            setMessage({title: `Error saving comment. ${error.message}`, isError: true, timestamp: moment()})
        }
    }

    return (
        <div>
            <div className='d-flex jc-space-between ai-center '>
                <div className='d-flex jc-flex-start ai-center comment-icons'>
                    <div className='d-flex jc-center ai-center mr-20' onClick={handleClickLike}>
                        <i className='bi bi-hand-thumbs-up-fill' style={{color: didLike && 'var(--tint-color)'}}/>
                        <h5 className=' mr-3' style={{color: didLike && 'var(--tint-color)'}}>{formatNumber(likes)}</h5>
                        <h5 style={{color: didLike && 'var(--tint-color)'}}>{formatUnit('like', likes)}</h5>
                    </div>
                    <div className='d-flex jc-center ai-center' onClick={handleClickComment}>
                        <i className='bi bi-chat-square-fill'/>
                        <h5 className='mr-3 lc-1'>{formatNumber(comments.length)}</h5>
                        <h5>{formatUnit('comment', comments.length)}</h5>
                    </div> 
                </div>
                <h5 className='c-tc fw-s action-link' onClick={() => setCommentsHidden(curr => !curr)}>
                    {commentsHidden ? 'Show comments' : 'Hide comments'}
                </h5>
            </div>
            <div style={{display: commentsHidden && 'none'}}>
                <div style={{borderTop: '1px solid var(--bc)', marginTop: 5, paddingTop: 5}}>
                    {comments.map( (comment, idx) => 
                        <Comment key={idx} style={{padding: '5px 10px'}}
                            parentID={props.parentID}
                            isReply={false}
                            comment={comment}
                            fetchData={fetchComments}
                        />
                    )}
                </div>
                <div className='d-flex jc-flex-start ai-flex-start' style={{ padding: 10 }} >
                    {thisUser.iconURL && <img src={thisUser.iconURL} className='user-icon-small' />}
                    {!thisUser.iconURL && 
                        <div className='user-icon-default'>
                            <i className='bi bi-person' />
                        </div>
                    }
                    <div className='w-100'>
                        <div className='d-inline-flex jc-flex-start ai-center'>
                            <p className='fw-m mr-10 mb-5'>{thisUser.displayName}</p>
                        </div>
                        <form onSubmit={handleSubmitComment}>
                            <textarea ref={commentRef} value={comment} onChange={e => setComment(e.target.value)} required={true}
                                placeholder='Write a comment' rows={2} style={{resize: 'vertical', width: '100%', minHeight: 35}}
                                className='mb-5 bs-bb'
                                maxLength={500}
                            />
                            <button className='solid-btn-secondary' type='submit' disabled={comment.length === 0}>Comment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
