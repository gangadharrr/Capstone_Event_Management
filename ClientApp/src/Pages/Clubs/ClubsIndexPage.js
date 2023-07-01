import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./ClubIndexPage.css"
import ReactDOM from 'react-dom'
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellSlash, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ProfileCardDisplay } from "../../components/ProfileCardDisplay/ProfileCardDisplay"
import authService from '../../components/api-authorization/AuthorizeService'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize";
export function ClubsIndexPage() {
  const [notifications, setNotifications] = useState(false)
  const location = useLocation()
  const [spinner, setSpinner] = useState(true);
  const queryParameters = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const [data, setData] = useState([{
    name: null,
    description: null,
    president: null,
    professorIncharge: null,
    clubEmail: null,
    price: null,
    availableSeats: null,
    clubPicture: null,
    err_name: null,
    err_description: null,
    err_president: null,
    err_professorIncharge: null,
    err_clubEmail: null,
    err_price: null,
    err_availableSeats: null,
    err_clubPicture: null
  }])

  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get(`clubs/${queryParameters.get('id')}`, {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        setData([response.data])
        axios.get(`students/${response.data.president}`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res1) => {
          let _data = response.data
          _data.presidentName = res1.data.name
          setData([_data])
        })
        axios.get(`professors/${response.data.professorIncharge}`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res2) => {
          let _data = response.data
          _data.professorInchargeName = res2.data.name
          setData([_data])
        })
        setSpinner(false)

      }).catch((error) => {
        console.log(error.response.data);
      })
    })
  },[])
  return (
    <React.Fragment>
      {
        data.map((val) => {
          return (spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
            <div className="club-index-page">
              <div className='club-index-page-img'>
                <img src="https://res.cloudinary.com/dujyzevpx/image/upload/v1687345454/Images/HomePageBG_glzmob.jpg" className="club-img-top" alt="..." />
              </div>
              <div className='club-index-page-body'>
                <div className='club-index-page-head'>
                  <div>
                  <div className='club-index-page-head-img'>
                    <img src={val.clubPicture} className="club-img-profile" alt="..." />
                  </div>

                  <h1 className='club-index-page-title'>{val.name}</h1>
                  <p className='club-index-page-email'><FontAwesomeIcon icon={faEnvelope} /> {val.clubEmail}</p>
                  </div>
                  <div id="button-area">

                  <button className='btn btn-primary' id='register-button'>Join {val.price == 0 ? "free" : `of ₹${val.price}`} </button>
                  {notifications ? <button className='btn btn-success ' id='notification-button'onClick={() => setNotifications(!notifications)}><FontAwesomeIcon icon={notifications ? faBell : faBellSlash} /></button> :
                    <button className='btn btn-outline-success' id='notification-button' onClick={() => setNotifications(!notifications)}><FontAwesomeIcon icon={notifications ? faBell : faBellSlash} /></button>
                  }
                  </div>
                </div>
                <hr />
                <div className='club-index-page-content'>
                  <h4>About the Club</h4>
                  <p>{val.description}</p>
                </div>  
                <hr />
                <div className='club-index-page-footer'>
                  <div className='club-index-page-footer-title'><h4>Club Guardians</h4></div>
                  <div className='club-index-page-footer-img'>
                    <ProfileCardDisplay imgsrc={`Images/${val.professorIncharge}`} title={val.presidentName} role="president" email={val.president} btnsrc={`/members-index-page?id=${val.president}&member=students&returnUrl=${window.location.pathname}${window.location.search}`} />
                    <ProfileCardDisplay imgsrc={`Images/${val.professorIncharge}`} title={val.professorInchargeName} role="president" email={val.professorIncharge} btnsrc={`/members-index-page?id=${val.professorIncharge}&member=professors&returnUrl=${window.location.pathname}${window.location.search}`} />
                  </div>
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
