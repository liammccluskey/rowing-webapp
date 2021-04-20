import React, {useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import C2Results from '../misc/C2Results'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
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
        if (user._id === thisUser._id) { return }
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

    function handleClickComment() {
        setCommentsHidden((false))
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

    async function handleDeleteComment(comment) {
        if (!window.confirm('Are you sure you want to delete this message?')) { return }
        try {
            await api.delete(`/comments?user=${thisUser._id}&comment=${comment._id}`)
            setMessage({title: 'Your comment was deleted', isError: false, timestamp: moment()})
            fetchComments()
        } catch (error) {
            setMessage({title: `Error deleting comment. ${error.message}`, isError: true, timestamp: moment()})
        }
    }

    return (
        <div>
            <div className='d-flex jc-space-between ai-center mb-10'>
                <div className='d-flex jc-flex-start ai-center comment-icons'>
                    <i className='bi bi-hand-thumbs-up mr-10' onClick={handleClickLike}/>
                    <p className='c-cs mr-20'>{likes} likes</p>
                    <i className='bi bi-chat-square-text mr-10' onClick={handleClickComment}/>
                    <p className='c-cs mr-20'>{comments.length} comments</p>
                </div>
                <h5 className='c-tc fw-s action-link' onClick={() => setCommentsHidden(curr => !curr)}>
                    {commentsHidden ? 'Show comments' : 'Hide comments'}
                </h5>
               
            </div>
            
            <div style={{display: commentsHidden && 'none'}}>
                <div style={{borderTop: '1px solid var(--bc)'}}>
                    {comments.map( (comment, idx) => (
                        <div key={idx} className='d-flex jc-flex-start' style={{padding: 10}}>
                            {comment.user.iconURL && <img src={comment.user.iconURL} className='user-icon' />}
                            {!comment.user.iconURL && 
                                <div className='user-icon-default'>
                                    <i className='bi bi-person' />
                                </div>
                            }
                            <div>
                                <div className='d-inline-flex jc-flex-start ai-center mb-5'>
                                    <p className='fw-l mr-10 page-link' onClick={() => handleClickUser(comment.user)}>
                                        {comment.user.displayName}
                                    </p>
                                    <p className='c-cs mr-10'>{moment(comment.createdAt).fromNow()}</p>
                                    <i className='bi bi-trash icon-btn-small' style={{display: thisUser._id !== comment.user._id && 'none' }} 
                                        onClick={() => handleDeleteComment(comment)}
                                    />
                                </div>
                                <p style={{whiteSpace: 'normal'}}>{comment.message}</p>
                            </div>
                        
                        </div>
                    ))}
                </div>
                <div className='d-flex jc-flex-start ai-flex-start' style={{ padding: 10, paddingRight: 30 }} >
                    {thisUser.iconURL && <img src={thisUser.iconURL} className='user-icon' />}
                    {!thisUser.iconURL && 
                        <div className='user-icon-default'>
                            <i className='bi bi-person' />
                        </div>
                    }
                    <div className='w-100'>
                        <div className='d-inline-flex jc-flex-start ai-center'>
                            <p className='fw-l mr-10 mb-5'>{thisUser.displayName}</p>
                        </div>
                        <form onSubmit={handleSubmitComment}>
                            <textarea ref={commentRef} value={comment} onChange={e => setComment(e.target.value)} required={true}
                                placeholder='Write a comment' rows={2} style={{resize: 'vertical', width: '100%', minHeight: 35}}
                                className='mb-5'
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

