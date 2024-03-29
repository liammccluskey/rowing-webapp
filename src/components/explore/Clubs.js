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

export default function Clubs() {
    const {currentUser, thisUser} = useAuth()
    const {setMessage} = useMessage()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const searchRef = useRef()
    const [submittedSearch, setSubmittedSearch] = useState(null)    // club name
    const [currPage, setCurrPage] = useState(1)

    function handleCreateClub() {
        history.push('/club-create')
    }

    function handleClickClub(club) {
        history.push(`/clubs/${club.customURL}/general`)
    }
    
    async function handleSubmitSearch(e) {
        e.preventDefault()
        if ( !searchRef.current.value) {return}

        setSubmittedSearch(searchRef.current.value)
        await searchClubs(searchRef.current.value, 1)
        setCurrPage(1)
    }

    async function onClickPrevious() {
        await searchClubs(submittedSearch, currPage - 1)
        setCurrPage( curr => curr - 1 )
    }

    async function onClickNext() {
        await searchClubs(submittedSearch, currPage + 1)
        setCurrPage( curr => curr + 1 )
    }

    async function searchClubs(clubName, pageNum) {
        setLoading(true)
        setResults(null)
        try {
            const res = await api.get(`/clubs/search?name=${clubName}&page=${pageNum}&pagesize=15`)
            setResults(res.data)
            setSubmittedSearch(clubName)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
    <div>
        <MainHeader />
        <ExploreHeader subPath='/clubs' />
        <div className='main-container'>
            <br /><br />
            <div className='d-flex jc-space-between ai-center'>
                <form onSubmit={handleSubmitSearch}>
                    <div className='search-bar' style={{backgroundColor: 'var(--bgc-light)'}}>
                        <i className='bi bi-search' />
                        <input ref={searchRef} type='text' placeholder='Find a club by name' style={{borderColor: 'transparent', width: 250}} /> 
                    </div>
                </form>
                
                <button onClick={handleCreateClub}className='solid-btn-secondary'>Create a Club</button>
            </div>
            <br />
            <div className='float-container'>
                <table style={{width: '100%'}} className='data-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(submittedSearch && results && !loading) && results.clubs.map((club, index) => 
                            <tr key={index} onClick={() => handleClickClub(club)} style={{cursor: 'pointer'}}>
                                <td >
                                    <div className='d-flex jc-flex-start ai-center'>
                                        <img src={club.iconURL} className='club-icon-medium mr-10'/>
                                        <h4 className='page-link'>{club.name}</h4>
                                    </div>
                                    
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {( (submittedSearch && !loading && !results.clubs.length) || !submittedSearch ) &&
                    <div className='search-message'>
                    {(submittedSearch && !loading) ? 
                        !results.clubs.length && `We couldn't find any clubs matching the name "${submittedSearch}"`
                        :
                        'Use the search bar above to find clubs'
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