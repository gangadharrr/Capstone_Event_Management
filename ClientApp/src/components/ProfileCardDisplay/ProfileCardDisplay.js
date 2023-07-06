import React,{useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import "./ProfileCardDisplay.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellSlash,faBell,faEnvelope } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import authService from '../api-authorization/AuthorizeService'
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation'

export function ProfileCardDisplay(props) {
    const [data,setData]=useState(null)
    const [spinner,setSpinner]=useState(true)
    const navigate = useNavigate()
    useEffect(() => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${props.imgsrc}/1`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          setData(response.data)
          setSpinner(false)
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      })
    },[])
    return (
    <div className="card" id='profile-card' onClick={()=>navigate(props.btnsrc)} >
    
      <img src={data?data.profileUrl:'https://res.cloudinary.com/dujyzevpx/image/upload/v1/Images/Account_Logo_jton6z.png?_a=BAJFJtWI0'} className="card-img-top" alt="..."  id="profile-card-img-top"/>
    
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
