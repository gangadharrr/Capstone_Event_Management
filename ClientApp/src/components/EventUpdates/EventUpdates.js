import { React, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../api-authorization/AuthorizeService'
import axios from 'axios'
import Linkify from 'react-linkify';
import { DropdownItem, DropdownMenu, DropdownToggle, Dropdown } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faL } from '@fortawesome/free-solid-svg-icons'
import "./EventUpdates.css"
export function EventUpdatesMessage(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editable, setEditable] = useState(props.editable ? true : false);
    const [message, setMessage] = useState(props.obj.message)
    const DateFormatter = (date) => {
        var d = new Date(date);
        return d.toDateString();
    }
    async function deleteEventUpdates() {
        try {

            if (window.confirm(`Are you sure you want to delete this message?`)) {
                authService.getAccessToken().then(token => {
                    axios.delete(`eventupdates/${props.obj.messageId}`, {
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                    }).then((res) => {
                        window.location.reload()
                    })
                })
            }
        }
        catch (err) {
            alert('Error:Something went wrong')
        }
    }
    async function putEventUpdates() {
        authService.getAccessToken().then(token => {
            axios.put(`eventupdates/${props.obj.messageId}`,
                {
                    "messageId": props.obj.messageId,
                    "eventId": props.obj.eventId,
                    "message": message,
                    "email": props.obj.email,
                    "threadId": props.obj.threadId,
                    "isEdited": true,
                    "collegeEvents": {
                        "eventId": 0,
                        "clubId": 0,
                        "name": "string",
                        "resourcePerson": "string",
                        "price": 0,
                        "discountPrice": 0,
                        "modeOfEvent": "string",
                        "startDateTimeOfEvent": "2023-07-10T12:33:10.476Z",
                        "endDateTimeOfEvent": "2023-07-10T12:33:10.476Z",
                        "lastDayToRegister": "2023-07-10T12:33:10.476Z",
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
                {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(() => {
                    setMessage('')
                    window.location.reload()
                }).catch((err) => {
                    console.log(err)
                })
        })
    }
    return (
        <div className='event-update-message-box'>
            <div className='event-update-message-header'>
                <b className='event-update-message-user'>@{String(props.obj.email).split('@')[0]}</b>
                <div className='event-update-message-time'>
                    <p >{DateFormatter(props.obj.dateTimeNow)}{props.obj.isEdited? " (Edited)" : ""}</p>
                    <div className="three-dot-icon" style={{ display: "inline-flex" }} >
                        <Dropdown isOpen={dropdownOpen} toggle={() => { setDropdownOpen(!dropdownOpen) }} direction="down" menuRole="listbox" >
                            <DropdownToggle color='plain' size='sm' id='dropdown-sm-btn'><FontAwesomeIcon icon={faEllipsisVertical} /></DropdownToggle>
                            <DropdownMenu end={true}>
                                <DropdownItem onClick={() => setEditable(true)}>Edit</DropdownItem>
                                <DropdownItem onClick={deleteEventUpdates}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </div>
            </div>
            {editable ?
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <textarea className='form-control' id='EventUpdatesTextarea' placeholder='Write here' onChange={(e) => setMessage(e.target.value)}>{message}</textarea>
                    <div className='events-updates-president-box-buttons'>
                        <button className='btn btn-sm btn-success' onClick={putEventUpdates} >Save</button>
                        <button className='btn btn-sm btn-danger' onClick={() => setEditable(false)}>Cancel</button>
                    </div>
                </div>
                : <Linkify >{props.obj.message}</Linkify>}
        </div>
    )
}
export function EventPresidentUpdates(props) {
    const [message, setMessage] = useState('')
    const location = useLocation()
    const queryParameters = new URLSearchParams(location.search)
    async function postEventUpdates() {
        authService.getAccessToken().then(token => {
            axios.post(`eventupdates`, {
                "eventId": queryParameters.get('id'),
                "message": message,
                "email": props.email,
                "threadId": props.threadId ? props.threadId : -1,
                "collegeEvents": {
                    "eventId": 0,
                    "clubId": 0,
                    "name": "string",
                    "resourcePerson": "string",
                    "price": 0,
                    "discountPrice": 0,
                    "modeOfEvent": "string",
                    "startDateTimeOfEvent": "2023-07-10T07:27:16.303Z",
                    "endDateTimeOfEvent": "2023-07-10T07:27:16.303Z",
                    "lastDayToRegister": "2023-07-10T07:27:16.303Z",
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
                {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(() => {
                    setMessage('')
                    window.location.reload()
                }).catch((err) => {
                    console.log(err)
                })
        })
    }
    return (
        <div className='events-updates-president-box'>
            <div className='events-updates-president-box-header'>
                <b>@{props.name}</b>
            </div>
            <textarea className='form-control' id='EventUpdatesTextarea' placeholder='Write here' onChange={(e) => setMessage(e.target.value)}>{message}</textarea>
            <div className='events-updates-president-box-buttons'>
                <button className='btn btn-sm btn-success' onClick={postEventUpdates}>Post</button>
            </div>
        </div>
    )
}

