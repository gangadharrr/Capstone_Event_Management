import React from 'react'
import './EventCardDisplay.css'
import { Link, useNavigate } from 'react-router-dom'
import {ColoredCircle} from "../ColoredCircle/ColoredCircle"

export function EventCardDisplay(props) {
    const navigate = useNavigate()
    return (
        <div className="card" id='event-card' onClick={() => navigate(props.btnsrc)} >
            <div style={{width: '80%',textAlign: 'end'}}>

            <ColoredCircle color={props.ActiveColor}/>
            </div>
            <img src={props.imgsrc} className="card-img-top" alt="..." />
            <div className="card-body" id='event-card-body'>
                <h5 className="card-title" id='event-card-title'>{props.title}</h5>
                <div id="event-card-text" style={{ textAlign: 'center' }}>
                    <p>{props.clubName}<br/>{props.resourcePerson}<br/>{props.modeOfEvent}<br/>{props.lastDate}</p>
                </div>
                <Link to={props.btnsrc} className="btn btn-success" id='card-button'>Register</Link>
            </div>
        </div>

    )
}
