import React, { useState, useEffect,useRef } from 'react'
import { useQuery } from "react-query";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import {CSVLink} from 'react-csv'

export function EventRegistrationsIndexView() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParameters = new URLSearchParams(location.search)
    const [eventRegistrationData, setEventRegistrationData] = useState([])
    const [spinner, setSpinner] = useState(true);
    const csvLink=useRef()
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get(`eventregistrations/${queryParameters.get('id')}/events/1`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((res) => {
                setEventRegistrationData(res.data)
            })
            setSpinner(false)
        })
    }, [])
    const DateFormatter = (date) => {
        var d = new Date(date);
        return d.toDateString() + " " + d.toLocaleTimeString();
    }
    return (spinner? <LoadingAnimation type='puff' text="Loading..." /> :
        <React.Fragment>
            <h1>Event Registrations</h1>

            <p style={{ textAlign: 'right' }}>
                <Link className='btn btn-primary' to={queryParameters.get('returnUrl')} >Back to List</Link> &nbsp;
                <CSVLink className='btn btn-success' data={eventRegistrationData} filename='Event-Registrations.csv'>Export to CSV</CSVLink>
            </p>
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            Email
                        </th>
                        <th>
                            Date of Registration
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {eventRegistrationData.map(item => {
                        return (
                            <tr>
                                <td>
                                    {item.email}
                                </td>
                                <td>
                                    {DateFormatter(item.dateTimeNow)}
                                </td>
                            </tr>
                        )
                    })}


                </tbody>
            </table>
        </React.Fragment>
    )
}

