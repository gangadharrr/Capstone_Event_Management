import React, { Component, useState, useEffect, useRef } from 'react';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { EventCardDisplay } from '../../components/EventCardDisplay/EventCardDisplay';
import axios from 'axios';
import authService from '../../components/api-authorization/AuthorizeService';

import './EventsPage.css'

export function EventsPage() {
    const [eventsData, setEventsData] = useState(null);
    const [clubNames, setClubNames] = useState([])
    const [roles, setRoles] = useState([])
    const [spinner, setSpinner] = useState(true);
    useEffect(() => {
        axios.get(`collegeevents`).then((res) => {
            setEventsData(res.data)
            axios.get(`clubs`).then((response) => {
                let _data = {}
                response.data.map((val) => {
                    _data[val.clubId] = val.name
                })
                setClubNames(_data)
                authService.getUser().then((user) => {
                    axios.get(`customidentityrole/details/${user.name}/1`).then((responseRole) => {
                        console.log(responseRole.data)
                        setRoles(responseRole.data)
                    })
                }).catch((error) => {
                    console.log(error);
                })
                setSpinner(false)

            })
        })
    },[])
    const DateFormatter = (date) => {
        var d = new Date(date);
        return d.toDateString();
      }
    return (spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
        <React.Fragment>
            <h1>Events</h1>
            <hr />
            <div className='events-page'>
            {eventsData.map((item) => {
                return(
                    <EventCardDisplay
                    ActiveColor={roles.includes(item.accessLevel)?"rgb(0, 255, 0)":"rgb(255, 0, 0)"}
                    imgsrc={item.pictureUrl}
                    title={item.name}
                    modeOfEvent={item.modeOfEvent}
                    clubName={clubNames[item.clubId]}
                    lastDate={"Last Date : " + DateFormatter(item.lastDayToRegister)}
                    resourcePerson={item.resourcePerson}
                    btnsrc={`/college-events-index-page?id=${item.eventId}`} />
                )
            })}
           
            </div>
        </React.Fragment>
    )
}

