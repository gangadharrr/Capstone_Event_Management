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
  const cld = new Cloudinary({cloud:{cloudName: 'dujyzevpx'}});
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
  const [president, setPresident] = useState([{
    name: null,
    email: null,
    batch: null,
    section: null,
    rollNumber: null,
    normalizedDegree: null,
    normalizedBranch: null,
    err_name: '',
    err_email: '',
    err_batch: '',
    err_section: '',
    err_rollNumber: '',
    err_normalizedDegree: '',
    err_normalizedBranch: ''
  }])
  const [professorIncharge, setProfessorIncharge] = useState([{
    professorId: null,
    name: null,
    email: null,
    designation: null,
    normalizedDegree: null,
    normalizedBranch: null,
    err_professorId: null,
    err_name: null,
    err_email: null,
    err_designation: null,
    err_normalizedDegree: null,
    err_normalizedBranch: null
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
  }, [])
  return (
    <React.Fragment>
      {
        data.map((val) => {
          return (spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
            <div className="club-index-page">
              <div className='club-index-page-img'>
                <img src={val.clubPicture} className="club-img-top" alt="..." />
              </div>
              <div className='club-index-page-body'>
                <div className='club-index-page-head'>
                  <h1 className='club-index-page-title'>{val.name}</h1>
                  <button className='btn btn-primary register-button'>Join {val.price == 0 ? "free" : `of ₹${val.price}`} </button>
                  {notifications ? <button className='btn btn-success notification-button' onClick={() => setNotifications(!notifications)}><FontAwesomeIcon icon={notifications ? faBell : faBellSlash} /></button> :
                    <button className='btn btn-outline-success notification-button' onClick={() => setNotifications(!notifications)}><FontAwesomeIcon icon={notifications ? faBell : faBellSlash} /></button>
                  }
                  <p className='club-index-page-email'><FontAwesomeIcon icon={faEnvelope} /> Morzilla@sist.com</p>
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
                    <ProfileCardDisplay imgsrc={`Images/${val.professorIncharge}`} title={val.presidentName} role="president" email={val.president} btnsrc={`/`} />
                    <ProfileCardDisplay imgsrc={`Images/${val.professorIncharge}`} title={val.professorInchargeName} role="president" email={val.professorIncharge} btnsrc={`/`} />
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
