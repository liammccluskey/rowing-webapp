import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import {useMessage} from '../../contexts/MessageContext'
import Loading from '../misc/Loading'
import Pending from '../misc/Pending'
import axios from 'axios'
import moment from 'moment'
import {formatNumber} from '../../scripts/Numbers'
import CustomGroupedBar from '../charts/CustomGroupedBar'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default function UserInfoCard(props) {
    const {currentUser, thisUser, fetchThisUser} = useAuth()
    const {setMessage} = useMessage()
    const history = useHistory()
    const [stats, setStats] = useState(null)
    const [partnerStats, setPartnerStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const [follows, setFollows] = useState({
        followees: [],
        followers: []
    })
    const [loadingFollows, setLoadingFollows] = useState(true)
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const [selectedTimeframe, setSelectedTimeframe] = useState('week')

    const [menuHidden, setMenuHidden] = useState(true)
    const [followType, setFollowType] = useState('followees')
    const [selectedPartner, setSelectedPartner] = useState(null)

    const selfGraphStyle = {
        backgroundColor: '--tint-color-translucent',
        borderColor: '--tint-color',
        label: thisUser.displayName
    }
    
    const partnerGraphStyle = {
        backgroundColor: '--color-translucent-purple',
        borderColor: '--color-purple',
        label: thisUser.trainingPartner ? thisUser.trainingPartner.displayName : 'partner'
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/users/${thisUser._id}/statistics`)
                setStats(res.data)
                if (thisUser.hasOwnProperty('trainingPartner') && thisUser.trainingPartner !== null) {
                    const res = await api.get(`/users/${thisUser.trainingPartner._id}/statistics`)
                    setPartnerStats(res.data)
                }

            } catch (error) {
                console.log(error)
            } 
            setLoading(false)
            
        }
        async function fetchFollowing() {
            try {
                let res = await api.get(`/follows/user/${thisUser._id}/followees`)
                setFollows(curr => ({...curr, followees: res.data}))
                res = await api.get(`/follows/user/${thisUser._id}/followers`)
                setFollows(curr => ({...curr, followers: res.data}))
            } catch (error) {
                console.log(error.message)
            }
            setLoadingFollows(false)
        }

        fetchData()
        fetchFollowing()
        console.log('fetching stats')
    }, [])

    function handleClickMenu() {
        setMenuHidden(false)
    }

    function handleClickCancel() {
        setSelectedPartner(null)
        setMenuHidden(true)
    }

    async function handleClickSubmit() {
        if (selectedPartner === null) {
            setMessage({title: 'Please select a training partner first', isError: true, timestamp: moment()})
            return
        } 
        setLoadingUpdate(true)
        setTimeout( async () => {
            try {
                const res = await api.patch(`/users/${thisUser._id}/trainingPartner`, {trainingPartner: selectedPartner._id})
                setMessage({title: res.data.message, isError: false, timestamp: moment()})
            } catch (error) {
                setMessage({title: `Error setting training partner. ${error.response.data.message}`, isError: true, timestamp: moment()})
            }
            setLoadingUpdate(false)
            setMenuHidden(true)
            window.location.reload()
        }, (1*1000));
    }

    async function handleClickRemovePartner() {
        setLoadingUpdate(true)
        setTimeout( async () => {
            try {
                const res = await api.patch(`/users/${thisUser._id}/trainingPartner`, {trainingPartner: null})
                setMessage({title: 'Removed training partner', isError: false, timestamp: moment()})
            } catch (error) {
                setMessage({title: `Error removing training partner. ${error.response.data.message}`, isError: true, timestamp: moment()})
            }
            setLoadingUpdate(false)
            setMenuHidden(true)
            window.location.reload()
        }, (1*1000));
    }

    const graphInfo = {
        week: {
            labels: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            labelFreq: 1, maxLabelLength: 1
        },
        month: {
            labels: Array(moment().daysInMonth()).fill(0).map((l, i) => i + 1),
            labelFreq: 10, maxLabelLength: 2
        },
        year: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            labelFreq: 3, maxLabelLength: 3
        }
    }

    return (
        <div style={{...props.style}} className='bs-bb'>
            {loading ? <Loading /> :
            <div className='float-container' style={{padding: '20px 20px'}} >
                <div className='d-flex jc-space-between ai-center mb-15'>
                    <h3>{thisUser.trainingPartner ? 'Meters Compared' : 'Your Meters'}</h3>
                    <div className='tooltip'>
                        <i className='bi bi-three-dots icon-btn-circle' onClick={handleClickMenu}/>
                        <div className='tooltip-text'>
                            <p>Pick a Training partner</p>
                        </div>
                    </div>
                </div>
                <div className='fullscreen-blur d-flex jc-center ai-center' style={{display: menuHidden && 'none'}}>
                    <div style={{width: 600, padding: '20px 20px'}} className='float-container'>
                        <h2>Compare your meters with a friend</h2>
                        <br />
                        <p >Help yourself stay on top of your training goals by comparing your meters with a friend</p>
                        <br /><br />
                        <div className='d-flex jc-space-between ai-center'>
                            <select value={followType} onChange={e => setFollowType(e.target.value)}>
                                <option value='followees'>I'm following</option>
                                <option value='followers'>Following me</option>
                            </select>
                            {selectedPartner !== null && 
                                <div style={{border: '1px solid var(--color-yellow)', borderRadius: 5}}
                                    className='d-flex jc-flex-start ai-center bs-bb'
                                >
                                    <p style={{padding: 7, color: 'var(--color-yellow-text)', backgroundColor: 'var(--color-translucent-yellow)'}}>
                                        Selected Partner
                                    </p>
                                    <p style={{padding: 7}}>{selectedPartner.displayName}</p>
                                </div>
                                
                            }
                        </div>
                        <br />
                        {loadingFollows ? <div className='loading-message'><Pending />Loading followers...</div>
                            :
                            <div className='trans-container' style={{height: 200, overflow: 'scroll', padding: 0}}>
                                {follows[followType].length === 0 &&
                                    <p className='c-cs' style={{padding: 15}}>You have no {followType}</p>
                                }
                                {follows[followType].map((user, idx) => (
                                    <div key={idx} className='clickable-container d-flex jc-space-between ai-center'>
                                        <div className='d-flex ai-center'>
                                            {user.iconURL ? 
                                                <img src={user.iconURL} className='user-icon-small mr-20'/>
                                                :
                                                <div className='user-icon-default-small'>
                                                        <i className='bi bi-person' />
                                                    </div>
                                            }
                                            <p>{user.displayName}</p>
                                        </div>
                                        <button className='clear-btn-secondary' onClick={() => setSelectedPartner({...user})}>
                                            Set training partner
                                        </button>
                                    </div>
                                ))}
                            </div>

                        }
                        <br />
                        <div className='d-flex jc-space-between'>
                            <button className='error-btn-secondary' onClick={handleClickRemovePartner} disabled={!thisUser.trainingPartner}>
                                Remove current partner
                            </button>
                            <div className='d-flex jc-flex-end'>
                                <button className='clear-btn-cancel mr-20' onClick={handleClickCancel}>Cancel</button>
                                <button className='solid-btn-secondary' onClick={handleClickSubmit} disabled={selectedPartner === null}>
                                    Submit
                                </button>
                            </div>
                        </div>
                        
                        {loadingUpdate && <div className='loading-message'><Pending />Processing your request...</div>}
                    </div>
                </div>

                {(thisUser.trainingPartner && true) && 
                    <div className='bgc-container d-flex jc-space-between' style={{margin: '20px 0px', padding: 10}}>
                        <div className='d-flex ai-center'>
                            <div style={{height: 10, width: 10, borderRadius: 3, backgroundColor: `var(${selfGraphStyle.borderColor})`}} 
                                className='mr-5'
                            />
                            <p className='c-cs'>You</p>
                        </div>
                        <div className='d-flex ai-center'>
                            <div style={{height: 10, width: 10, borderRadius: 3, backgroundColor: `var(${partnerGraphStyle.borderColor})`}} 
                                className='mr-5'
                            />
                            <p className='c-cs'>{thisUser.trainingPartner.displayName}</p>
                        </div>
                    </div>
                }
                <div>
                    <div className='d-flex jc-space-between ai-center mb-5' >
                        <h2 className='lc-1 c-tc fw-s'>
                            {formatNumber(stats.aggregate[`${selectedTimeframe}Meters`])} m
                        </h2>
                        {thisUser.trainingPartner && 
                            <h2 className='lc-1 fw-s' style={{color: `var(${partnerGraphStyle.borderColor})`}}>
                                {formatNumber(partnerStats.aggregate[`${selectedTimeframe}Meters`])} m
                            </h2>
                        }
                    </div>
                    <br />
                    <CustomGroupedBar 
                        height={115}
                        labelFreq={ graphInfo[selectedTimeframe].labelFreq }
                        maxLabelLength={ graphInfo[selectedTimeframe].maxLabelLength }
                        data={{
                            labels: graphInfo[selectedTimeframe].labels,
                            label: 'Meters',
                            datasets: thisUser.trainingPartner ? 
                                [
                                    {data: stats.plottable[`${selectedTimeframe}Meters`], ...selfGraphStyle},
                                    {data: partnerStats.plottable[`${selectedTimeframe}Meters`], ...partnerGraphStyle},
                                ]
                                : [ {data: stats.plottable[`${selectedTimeframe}Meters`], ...selfGraphStyle} ]
                        }}
                    />
                </div>
                <br />
                <div className='d-flex jc-space-between ai-center'>
                    {['week', 'month', 'year'].map( (timeframe, idx) =>
                        <h5 className={`${timeframe === selectedTimeframe ? 'menu-option-active' : 'menu-option' } tt-c`}
                            key={idx} onClick={() => setSelectedTimeframe(timeframe)}
                        >
                            {timeframe}
                        </h5>
                    )}
                </div>
                <br />
                <div className='d-flex jc-center' onClick={() => history.push('/training/statistics')}>
                    <button className='clear-btn-secondary' style={{flex: 1}}>View Stats</button>
                </div>
            </ div>
            }
        </div>
    )
}