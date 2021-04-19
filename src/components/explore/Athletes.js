import React, {useState, useRef} from 'react'
import ExploreHeader from './ExploreHeader'
import MainHeader from '../headers/MainHeader'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import axios from 'axios'
import moment from 'moment'
import Loading from '../misc/Loading'
import Paginator from '../misc/Paginator'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function Athletes() {
    const {currentUser, thisUser} = useAuth()
    const {setMessage} = useMessage()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const searchRef = useRef()
    const [submittedSearch, setSubmittedSearch] = useState(null)    // athlete name
    const [currPage, setCurrPage] = useState(1)

    function handleClickUser(user) {
        history.push(`/athletes/${user._id}`)
    }

    async function handleClickFollowUser(user) {
        /* needs fixing */
        return
        /*
        try {
            await api.post('/clubmemberships', {club: club._id, user: thisUser._id, role: 0})
            setMessage({title: `Joined "${club.name}"`, isError: false, timestamp: moment() })
            history.push(`/clubs/${club.customURL}/general`)
        } catch(error) {
            setMessage({title: `Error joining "${club.name}. ${error.message}"`, isError: true, timestamp: moment() })
        }
        */
    }

    async function handleSubmitSearch(e) {
        e.preventDefault()
        if ( !searchRef.current.value) {return}

        setSubmittedSearch(searchRef.current.value)
        await searchUsers(searchRef.current.value, 1)
        setCurrPage(1)
    }

    async function onClickPrevious() {
        await searchUsers(submittedSearch, currPage - 1)
        setCurrPage( curr => curr - 1 )
    }

    async function onClickNext() {
        await searchUsers(submittedSearch, currPage + 1)
        setCurrPage( curr => curr + 1 )
    }

    async function searchUsers(displayName, pageNum) {
        setLoading(true)
        setResults(null)

        try {
            const res = await api.get(`/users/search?displayName=${displayName}&page=${pageNum}&pagesize=15`)
            setResults(res.data)
            setSubmittedSearch(displayName)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
        
    }

    return (
    <div>
        <MainHeader />
        <ExploreHeader subPath='/athletes' />
        <div className='main-container'>
            <br /><br />
            <div className='d-flex jc-space-between ai-center'>
                <form onSubmit={handleSubmitSearch}>
                    <div className='search-bar' style={{backgroundColor: 'var(--bgc-light)'}}>
                        <i className='bi bi-search' />
                        <input ref={searchRef} type='text' placeholder='Find an athlete by name' style={{borderColor: 'transparent', width: 250}} /> 
                    </div>
                </form>
            </div>
            <br />
            <div className='float-container'>
                <table style={{width: '100%'}} className='data-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(submittedSearch && results && !loading) && results.users.map((user, index) => 
                            <tr key={index} onClick={() => handleClickUser(user)} style={{cursor: 'pointer'}}>
                                <td >
                                    <div className='d-flex jc-flex-start ai-center'>
                                        <img src={user.iconURL} className='user-icon'/>
                                        <h4 className='page-link'>{user.displayName}</h4>
                                    </div>
                                </td>
                                <td style={{textAlign: 'right'}}>
                                    <button onClick={() => handleClickFollowUser(user)} className='clear-btn-secondary'>Follow</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {( (submittedSearch && !loading && !results.users.length) || !submittedSearch ) &&
                    <div style={{textAlign: 'center', fontSize: 17, color: 'var(--color-secondary)', padding: '50px 20px'}}>
                    {(submittedSearch && !loading) ? 
                        !results.users.length && `We couldn't find any athletes matching the name "${submittedSearch}"`
                        :
                        'Use the search bar above to find athletes'
                    }
                    </div>
                }
                {loading && <Loading />}
            </div>
            <br />
            {(submittedSearch && !loading) && 
                <Paginator resultsCount={results.count} currPage={currPage}
                    onClickNext={onClickNext}
                    onClickPrevious={onClickPrevious}
                />
            }
            
            
        </div>
        
    </div>
        
    )
}