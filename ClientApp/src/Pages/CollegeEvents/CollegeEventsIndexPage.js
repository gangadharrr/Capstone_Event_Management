import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import "./CollegeEventsIndexPage.css"
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellSlash, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ProfileCardDisplay } from "../../components/ProfileCardDisplay/ProfileCardDisplay"
import { EventCardDisplay } from "../../components/EventCardDisplay/EventCardDisplay"
import authService from '../../components/api-authorization/AuthorizeService'
import { ApplicationPaths } from '../../components/api-authorization/ApiAuthorizationConstants';


export function CollegeEventsIndexPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParameters = new URLSearchParams(location.search)
    const [eventsData, setEventsData] = useState([]);
    const [hover, setHover] = useState(false)
    const [roles, setRoles] = useState(null)
    const [spinner, setSpinner] = useState(true);
    const [registered, setRegistered] = useState(false)
    useEffect(() => {
        axios.get(`collegeevents/${queryParameters.get('id')}`).then((res) => {
            setEventsData([res.data])
            axios.get(`clubs/${res.data.clubId}`).then((response) => {
                let _data = res.data
                _data['clubName'] = response.data.name
                setEventsData([_data])
                setSpinner(false)
            })
        })
    }, [])
    useEffect(() => {
        authService.getUser().then((user) => {
            authService.getAccessToken().then(token => {
                axios.get(`customidentityrole/details/${user.name}/1`).then((responseRole) => {
                    setRoles(responseRole.data)
                })
                axios.get(`customidentityrole/${user.name}/${queryParameters.get('id')}`, {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                }).then((res) => {
                    axios.get(`eventregistrations/${res.data.email}/${queryParameters.get('id')}`, {
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                    }
                    ).then((response1) => {
                        setRegistered(response1.data)
                    })
                })
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) => {
            console.log(error);
        })
    })
    async function eventRegistration() {
        authService.getUser().then(user => {
            authService.getAccessToken().then(token => {
                axios.get(`customidentityrole/${user.name}?role=${eventsData[0].accessLevel}`, {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                }).then((res) => {
                    if (res.data) {
                        axios.get(`customidentityrole/${user.name}/1`, {
                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                        }).then((res1) => {
                            axios.post(`eventregistrations`, {
                                "eventId": queryParameters.get('id'),
                                "email": res1.data.email,
                                "collegeEvents": {
                                    "eventId": 0,
                                    "clubId": 0,
                                    "name": "string",
                                    "resourcePerson": "string",
                                    "price": 0,
                                    "discountPrice": 0,
                                    "modeOfEvent": "string",
                                    "startDateTimeOfEvent": "2023-07-06T09:16:21.387Z",
                                    "endDateTimeOfEvent": "2023-07-06T09:16:21.387Z",
                                    "lastDayToRegister": "2023-07-06T09:16:21.387Z",
                                    "pictureUrl": "string",
                                    "posterUrl": "string",
                                    "accessLevel": "string",
                                    "venue": "string",
                                    "availableSeats": 0,
                                    "clubs": {
                                        "clubId": 0,
                                        "name": "string",
                                        "description": "string",
                                        "president": "string",
                                        "professorIncharge": "string",
                                        "clubEmail": "string",
                                        "price": 0,
                                        "availableSeats": 0,
                                        "clubPicture": "string",
                                        "students": {
                                            "name": "string",
                                            "email": "string",
                                            "batch": "string",
                                            "section": "string",
                                            "rollNumber": 0,
                                            "normalizedDegree": "string",
                                            "normalizedBranch": "string"
                                        },
                                        "professors": {
                                            "professorId": "string",
                                            "name": "string",
                                            "email": "string",
                                            "designation": "string",
                                            "normalizedDegree": "string",
                                            "normalizedBranch": "string"
                                        }
                                    }
                                }
                            },
                                { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }).then((res2) => {

                                    axios.put(`collegeevents/${queryParameters.get('id')}`, {
                                        "eventId": eventsData[0].eventId,
                                        "clubId": eventsData[0].clubId,
                                        "name": eventsData[0].name,
                                        "resourcePerson": eventsData[0].resourcePerson,
                                        "price": parseFloat(eventsData[0].price),
                                        "discountPrice": parseFloat(eventsData[0].discountPrice),
                                        "modeOfEvent": eventsData[0].modeOfEvent,
                                        "startDateTimeOfEvent": eventsData[0].startDateTimeOfEvent,
                                        "endDateTimeOfEvent": eventsData[0].endDateTimeOfEvent,
                                        "lastDayToRegister": eventsData[0].lastDayToRegister,
                                        "pictureUrl": eventsData[0].pictureUrl,
                                        "posterUrl": eventsData[0].posterUrl,
                                        "accessLevel": eventsData[0].accessLevel,
                                        "venue": eventsData[0].venue,
                                        "availableSeats": parseInt(eventsData[0].availableSeats) - 1,
                                        "clubs": {
                                            "clubId": 0,
                                            "name": "string",
                                            "description": "string",
                                            "president": "string",
                                            "professorIncharge": "string",
                                            "clubEmail": "string",
                                            "price": 0,
                                            "availableSeats": 0,
                                            "clubPicture": "string",
                                            "students": {
                                                "name": "string",
                                                "email": "string",
                                                "batch": "string",
                                                "section": "string",
                                                "rollNumber": 0,
                                                "normalizedDegree": "string",
                                                "normalizedBranch": "string"
                                            },
                                            "professors": {
                                                "professorId": "string",
                                                "name": "string",
                                                "email": "string",
                                                "designation": "string",
                                                "normalizedDegree": "string",
                                                "normalizedBranch": "string"
                                            }
                                        }
                                    },
                                        { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                                    ).then((res4) => {

                                        setRegistered(true)

                                    })

                                }).catch((error) => {
                                    console.log(error.response.data);
                                })
                        })
                    }
                    else {
                        alert("User is not a Member or Student")
                    }
                })
            }).catch((error) => {
                navigate(ApplicationPaths.Login + `?returnUrl=${window.location.href}`)
            })
        }).catch((error) => {
            navigate(ApplicationPaths.Login + `?returnUrl=${window.location.href}`)
        })
    }
    async function eventUnRegistration() {
        authService.getUser().then(user => {
            authService.getAccessToken().then(token => {
                axios.get(`customidentityrole/${user.name}/1`, {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                }).then((res) => {
                    axios.delete(`/eventregistrations/${queryParameters.get('id')}/${res.data.email}`,
                        {
                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                        }
                    ).then((res1) => {
                        axios.put(`collegeevents/${queryParameters.get('id')}`, {
                            "eventId": eventsData[0].eventId,
                            "clubId": eventsData[0].clubId,
                            "name": eventsData[0].name,
                            "resourcePerson": eventsData[0].resourcePerson,
                            "price": parseFloat(eventsData[0].price),
                            "discountPrice": parseFloat(eventsData[0].discountPrice),
                            "modeOfEvent": eventsData[0].modeOfEvent,
                            "startDateTimeOfEvent": eventsData[0].startDateTimeOfEvent,
                            "endDateTimeOfEvent": eventsData[0].endDateTimeOfEvent,
                            "lastDayToRegister": eventsData[0].lastDayToRegister,
                            "pictureUrl": eventsData[0].pictureUrl,
                            "posterUrl": eventsData[0].posterUrl,
                            "accessLevel": eventsData[0].accessLevel,
                            "venue": eventsData[0].venue,
                            "availableSeats": parseInt(eventsData[0].availableSeats) - 1,
                            "clubs": {
                                "clubId": 0,
                                "name": "string",
                                "description": "string",
                                "president": "string",
                                "professorIncharge": "string",
                                "clubEmail": "string",
                                "price": 0,
                                "availableSeats": 0,
                                "clubPicture": "string",
                                "students": {
                                    "name": "string",
                                    "email": "string",
                                    "batch": "string",
                                    "section": "string",
                                    "rollNumber": 0,
                                    "normalizedDegree": "string",
                                    "normalizedBranch": "string"
                                },
                                "professors": {
                                    "professorId": "string",
                                    "name": "string",
                                    "email": "string",
                                    "designation": "string",
                                    "normalizedDegree": "string",
                                    "normalizedBranch": "string"
                                }
                            }
                        },
                            { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                        ).then((res4) => {
                            setRegistered(false)
                        })
                    })
                })
            })
        }).catch((error) => {
            console.log(error.response.data);
        })
    }
    return (spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
        <React.Fragment>
            {
                eventsData.map((val) => {
                    return (spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
                        <div className="event-index-page">
                            <div className='event-index-page-img'>
                                <img src={val.pictureUrl} className="event-img-top" alt="..." />
                            </div>
                            <div className="event-index-page-body">
                                <div className="event-index-page-head">
                                    <h1 className='event-index-page-title'>"{val.name}"</h1>
                                    <h5>An Event Organized by</h5>
                                    <h2 className='event-index-page-title'>{val.clubName}</h2>
                                    {roles === null 
                                        ? <Link className='btn btn-outline-primary' to={ApplicationPaths.Login} id='register-button'  >Login to Register</Link>
                                        :
                                        !roles.includes(val.accessLevel) ? <button className='btn btn-outline-danger' id='register-button' disabled >No Access</button>
                                            :
                                            val.availableSeats === 0 || val.lastDayToRegister - new Date() < 0 || !roles.includes(val.accessLevel)
                                                ? <button className='btn btn-outline-danger' id='register-button' disabled >Registration Closed</button>
                                                : registered
                                                    ? hover ? <button className='btn btn-danger' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={eventUnRegistration} id='register-button'>Unregister</button> : <button className='btn btn-outline-success' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={eventRegistration} id='register-button'>Registered</button>
                                                    : <button className='btn btn-primary' id='register-button' onClick={eventRegistration}>Register for {val.price === 0 ? "free" : `₹${val.price}`} </button>

                                    }
                                </div>
                                <hr />
                            </div>
                        </div>
                    )
                })
            }
        </React.Fragment>

    )
}
