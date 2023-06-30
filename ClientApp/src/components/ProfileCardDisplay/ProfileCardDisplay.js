import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import "./ProfileCardDisplay.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellSlash,faBell,faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react"
import axios from 'axios'

export function ProfileCardDisplay(props) {
    const cld = new Cloudinary({cloud:{cloudName: 'dujyzevpx'}});
    const myImg=cld.image(props.imgsrc)

    return (
    <div className="card" id='profile-card' >
    {
        <AdvancedImage cldImg={myImg} onError={e => e.target.src = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png"} id="profile-card-img-top"  />
    }
      <div className="card-body" id='profile-card-body'>
        <div  id='profile-card-title'>
        <h6 className="card-title">{props.title}</h6>
        </div>
        <div id='profile-card-details'>

        <p >{props.role}<br/>{props.email}<br/>{props.phone}</p>
        <Link to={props.btnsrc} className="btn btn-primary card-button " id='profile-card-button'>Visit Profile</Link>
        </div>
      </div>
  </div>
  )
}
