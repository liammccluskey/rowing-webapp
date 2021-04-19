import React, {useState, useEffect} from 'react'
import C2Results from './C2Results'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'
import { useMessage } from '../../contexts/MessageContext'
import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function ActivityCard(props) {
    const { thisUser } = useAuth()
    const { setMessage } = useMessage()

    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true)

    const [likes, setLikes] = useState(0)
    const [loadingLikes, setLoadingLikes] = useState()
    const [didLike, setDidLike] = useState(false)

    const [commentDisabled, setCommentDisabled] = useState(true)
    const [isCommenting, setIsCommenting] = useState(false)

    const [comment, setComment] = useState('')

    useEffect(() => {
        fetchComments()
        fetchLikes()
    }, [])

    async function fetchComments() {
        try {
            const res = await api.get(`/comments/parent/${props.activity._id}`)
            setComments(res.data)
            setIsCommenting(res.data.length > 0)
        } catch (error) {
            console.log(error)
        }
        setLoadingComments(false)
    }

    async function fetchLikes() {
        try {
            const res = await api.get(`/likes/parent/${props.activity._id}?user=${thisUser._id}`)
            setLikes(res.data.count)
            setDidLike(res.data.didLike)
        } catch (error) {
            console.log(error)
        }
        setLoadingLikes(false)
    }

    useEffect(() => {
        setCommentDisabled(comment.length === 0)
    }, [comment])

    async function handleClickLike() {
        async function submitLike() {
            try {
                await api.post('/likes', {user: thisUser._id, parent: props.activity._id})
                setMessage({title: 'You liked this activity', isError: false, timestamp: moment()})
                setDidLike(true)
            } catch (error) {
                setMessage({title: `Error liking activity. ${error.message}`, isError: true, timestamp: moment()})
            }
        }
        async function submitUnlike() {
            try {
                await api.delete(`/likes?user=${thisUser._id}&parent=${props.activity._id}`)
                setMessage({title: 'You unliked this activity', isError: false, timestamp: moment()})
                setDidLike(false)
            } catch (error) {
                setMessage({title: `Error unliking activity. ${error.message}`, isError: true, timestamp: moment()})
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
        setIsCommenting(true)
    }

    async function handleSubmitComment(e) {
        e.preventDefault()
        if (!comment.length) {return}
        try {
            const body = {parent: props.activity._id, user: thisUser._id, message: comment}
            await api.post('/comments', body)
            setMessage({title: 'Your comment was saved', isError: false, timestamp: moment()})
            fetchComments()
            setIsCommenting(false)
        } catch (error) {
            setMessage({title: `Error saving comment. ${error.message}`, isError: true, timestamp: moment()})
        }
    }

    function handleDeleteComment(comment) {

    }

    return (
        <div className='activity-card float-container'>
            <div className='d-flex jc-flex-start ai-flex-start'>
                {props.activity.user.iconURL && <img src={props.activity.user.iconURL} className='user-icon' />}
                {!props.activity.user.iconURL && 
                    <div className='user-icon-default'>
                        <i className='bi bi-person'/>
                    </div>
                }
                <div className='d-flex jc-space-between ai-flex-start fw-wrap w-100'>
                    <div>
                        <div className='mb-20'>
                            <p className='fw-l mb-2'>{props.activity.user.displayName}</p>
                            <p className='c-cs'>{moment(props.activity.createdAt).format('LLL')}</p>
                        </div>
                        <h2 className='fw-m mb-10'>{props.activity.session.workoutItems[props.activity.workoutItemIndex]}</h2>
                        <div className='d-flex jc-flex-start metrics-info'>
                            <div>
                                <p>Distance</p>
                                <h3 >{props.activity.distance.toLocaleString() + ' m'}</h3>
                            </div>
                            <div>
                                <p >Time</p>
                                <h3>{moment.duration(Math.round(props.activity.elapsedTime), 'seconds').format('h[h]  m[m] s[s]')}</h3>
                            </div>
                            <div>
                                <p>Calories</p>
                                <h3>{props.activity.totalCalories.toLocaleString() + ' cal'}</h3>
                            </div>
                        </div>
                    </div>
                    <C2Results activity={props.activity} style={{width: 230, marginTop: 10, float: 'right'}} />
                </div>
            </div>
            <div className='d-flex jc-flex-start ai-center comment-icons'>
                <i className='bi bi-hand-thumbs-up mr-10' onClick={handleClickLike}/>
                <p className='c-cs mr-20'>{likes} likes</p>
                <i className='bi bi-chat-square-text mr-10' onClick={handleClickComment}/>
                <p className='c-cs mr-20'>{comments.length} comments</p>
            </div>
            <br />
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
                            <div className='d-inline-flex jc-flex-start ai-center'>
                                <p className='fw-l mr-10 mb-5'>{comment.user.displayName}</p>
                                <p className='c-cs'>{moment(comment.createdAt).fromNow()}</p>
                            </div>
                            <p>{comment.message}</p>
                        </div>
                    
                    </div>
                ))}
            </div>
            <div className='d-flex jc-flex-start ai-flex-start'
                style={{
                    display: !isCommenting && 'none',
                    padding: isCommenting ? 10 : 0, paddingRight: isCommenting ? 30 : 0
                }} 
            >
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
                        <textarea value={comment} onChange={e => setComment(e.target.value)} required={true}
                            placeholder='Write a comment' rows={2} style={{resize: 'vertical', width: '100%', minHeight: 35}}
                            className='mb-5'
                        />
                        <button className='solid-btn-secondary' type='submit' disabled={commentDisabled}>Comment</button>
                    </form>
                    
                </div>
            </div>
            
        </div>
    )
}