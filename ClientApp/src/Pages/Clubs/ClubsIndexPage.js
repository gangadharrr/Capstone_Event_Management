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
import { Alert } from 'reactstrap';
import { ApplicationPaths, LoginActions } from '../../components/api-authorization/ApiAuthorizationConstants';
export function ClubsIndexPage() {
  const [notifications, setNotifications] = useState(false)
  const location = useLocation()
  const [spinner, setSpinner] = useState(true);
  const queryParameters = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const [hover,setHover]=useState(false)
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
  const [registered, setRegistered] = useState(false)
  useEffect(() => {
    authService.getUser().then(user => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${user.name}/${queryParameters.get('id')}`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          axios.get(`clubmembers/${res.data.email}/${queryParameters.get('id')}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }
          ).then((response) => {
            setRegistered(response.data)
          })
          axios.get(`subscriptions/${res.data.email}/${queryParameters.get('id')}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }).then((response) => {
            setNotifications(response.data)
          })
        })
      })
    })
  },[])
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
  async function ClubRegistration() {
    authService.getUser().then(user => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${user.name}?role=Student`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          if (res.data) {
            axios.get(`customidentityrole/${user.name}/1`, {
              headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((res1) => {
              axios.post(`clubmembers`, {
                'id': 0,
                'clubId': queryParameters.get('id'),
                'email': res1.data.email,
                clubs: {
                  clubId: 0,
                  name: 'string',
                  description: 'string',
                  president: 'string',
                  professorIncharge: 'string',
                  clubEmail: 'string',
                  price: 0,
                  availableSeats: 0,
                  clubPicture: 'string',
                  students: {
                    name: 'string',
                    email: 'string',
                    batch: 'string',
                    section: 'string',
                    rollNumber: 0,
                    normalizedDegree: 'string',
                    normalizedBranch: 'string'
                  },
                  professors: {
                    professorId: 'string',
                    name: 'string',
                    email: 'string',
                    designation: 'string',
                    normalizedDegree: 'string',
                    normalizedBranch: 'string'
                  }
                },
                students: {
                  name: 'string',
                  email: 'string',
                  batch: 'string',
                  section: 'string',
                  rollNumber: 0,
                  normalizedDegree: 'string',
                  normalizedBranch: 'string'
                }
              },
                { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }).then((res2) => {
                  axios.get(`clubs/${queryParameters.get('id')}`, {
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                  }).then((dataset) => {
                    axios.put(`clubs/${queryParameters.get('id')}`, {
                      clubId: data[0].clubId,
                      name: data[0].name,
                      description: data[0].description,
                      president: data[0].president,
                      professorIncharge: data[0].professorIncharge,
                      clubEmail: data[0].clubEmail.toLowerCase(),
                      price: parseFloat(data[0].price),
                      availableSeats: parseInt(data[0].availableSeats)-1,
                      clubPicture: data[0].clubPicture,
                      students: {
                          name: 'string',
                          email: 'string',
                          batch: 'string',
                          section: 'string',
                          rollNumber: 0,
                          normalizedDegree: 'string',
                          normalizedBranch: 'string'
                      },
                      professors: {
                          professorId: 'string',
                          name: 'string',
                          email: 'string',
                          designation: 'string',
                          normalizedDegree: 'string',
                          normalizedBranch: 'string'
                      }
                  },
                      { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                  ).then((res4) => {

                      setRegistered(true)
                    })
                  })
                    
                }).catch((error) => {
                  console.log(error.response.data);
                })
            })
          }
          else {
            alert("User is not a student")
          }
        })
      }).catch((error) => {
        navigate(ApplicationPaths.Login + `?returnUrl=${window.location.href}`)
      })
    }).catch((error) => {
      navigate(ApplicationPaths.Login + `?returnUrl=${window.location.href}`)
    })
  }
  async function clubUnRegistration()
  {
    authService.getUser().then(user => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${user.name}/1`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          axios.delete(`/clubmembers/${queryParameters.get('id')}/${res.data.email}`,
          {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }
          ).then((res1) => {
            axios.get(`clubs/${queryParameters.get('id')}`, {
              headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((dataset) => {
              axios.put(`clubs/${queryParameters.get('id')}`, {
                clubId: data[0].clubId,
                name: data[0].name,
                description: data[0].description,
                president: data[0].president,
                professorIncharge: data[0].professorIncharge,
                clubEmail: data[0].clubEmail.toLowerCase(),
                price: parseFloat(data[0].price),
                availableSeats: parseInt(data[0].availableSeats)+1,
                clubPicture: data[0].clubPicture,
                students: {
                    name: 'string',
                    email: 'string',
                    batch: 'string',
                    section: 'string',
                    rollNumber: 0,
                    normalizedDegree: 'string',
                    normalizedBranch: 'string'
                },
                professors: {
                    professorId: 'string',
                    name: 'string',
                    email: 'string',
                    designation: 'string',
                    normalizedDegree: 'string',
                    normalizedBranch: 'string'
                }
            },
                { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
            ).then((res4) => {

                setRegistered(false)
              })
            })
          })
        })
        })
      }).catch((error) => {
          console.log(error.response.data); 
        })
  }
  async function clubSubscribe()
  {
    authService.getUser().then(user => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${user.name}/1`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          console.log(res.data)
          axios.post("subscriptions",  
              {
                "id": 0,
                "clubId": queryParameters.get('id'),
                "email": res.data.email,
                "dateTimeNow": "2023-07-03T12:22:00.113Z",
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
          ,{
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }
          ).then((res1) => {
            setNotifications(true)
          })
        })
        })
      }).catch((error) => {
          console.log(error.response.data); 
        })
  }
  async function clubUnSubscribe()
  {
    authService.getUser().then(user => {
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${user.name}/1`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          axios.delete(`/subscriptions/${queryParameters.get('id')}/${res.data.email}`,
          {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }
          ).then((res1) => {

            setNotifications(false)
          })
        })
        })
      }).catch((error) => {
          console.log(error.response.data); 
    })
  }

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
                    {val.availableSeats==0
                    ?<button className='btn btn-outline-danger' id='register-button' disabled >Registration Closed</button>
                    :registered
                      ?hover ?<button className='btn btn-danger' onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={clubUnRegistration} id='register-button'>Unregister</button>:<button className='btn btn-outline-success' onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={clubUnRegistration} id='register-button'>Registered</button>
                      : <button className='btn btn-primary' id='register-button'  onClick={ClubRegistration}>Join {val.price == 0 ? "free" : `for ₹${val.price}`} </button>
                    
                    }
                    {notifications 
                      ?<button className='btn btn-outline-success' id='notification-button' onClick={clubUnSubscribe}><FontAwesomeIcon icon={notifications ?faBellSlash:faBell} /></button>
                     :<button className='btn btn-success' id='notification-button' onClick={clubSubscribe}><FontAwesomeIcon icon={notifications ?faBellSlash:faBell} /></button> 
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
