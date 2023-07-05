import React, { useState, useEffect } from 'react'
import axios from "axios";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import Select from "react-select";
import "./CollegeEventsViews.css"
import { Button } from 'reactstrap';

export function CollegeEventsIndexView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [clubData, setClubData] = useState(null)
  const [spinner, setSpinner] = useState(true);
  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get('clubs', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        let _data = {}
        response.data.map((val) => {
          _data[val.clubId] = val.name
        })
        setClubData(_data)
        axios.get('collegeevents', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
          setData(res.data)
          setSpinner(false)
        })
      })
    })

  }, [data])
  return (
    spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
      <React.Fragment>
        <h1>Index</h1>
        <p style={{ textAlign: 'right' }}>
          <Link className='btn btn-primary' to="/college-events-create-view">+ Create New</Link>&nbsp;
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>
                Event Name
              </th>
              <th>
                Origanizing Club
              </th>
              <th>
                ModeOfEvent
              </th>
              <th>
                Date Of Event
              </th>
              <th>
                AvailableSeats
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => {
              let startDate = new Date(val.startDateTimeOfEvent).toDateString()
              return (
                <tr key={val.eventId}>
                  <td>
                    {val.name}
                  </td>
                  <td>
                    {clubData[val.clubId]}
                  </td>
                  <td>
                    {val.modeOfEvent}
                  </td>
                  <td>
                    {startDate}
                  </td>
                  <td>
                    {val.availableSeats}
                  </td>
                  <td>
                    <Link className='btn btn-primary' to={"/college-events-edit-view?id=" + val.eventId}>Edit</Link> |&nbsp;
                    <Link className='btn btn-warning' to={"/college-events-details-view?id=" + val.eventId}>Details</Link> |&nbsp;
                    <button className='btn btn-danger'
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this Event (` + val.name + ")?")) {
                          authService.getAccessToken().then(token => {
                            authService.getUser().then(user => {

                              axios.delete(`collegeevents/${user.name}/${val.eventId}`, {
                                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                              }).then((response) => {
                                navigate("/college-events-index-view");
                              }).catch((error) => {
                                console.log(error)
                              })
                            })
                          })
                        }
                      }}
                    >Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </React.Fragment>
  )
}
export function CollegeEventsCreateView() {
  const navigate = useNavigate()
  const [clubData, setClubData] = useState(null)
  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get('clubs', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        let _list = []
        response.data.map((val) => {
          _list.push({ value: val.clubId, label: val.name })
        }
        )
        setClubData(_list)
      }).catch((error) => {
        console.log(error.response.data);
      })
    })
  }, [])
  const [data, setData] = useState([
    {
      clubId: 0,
      name: null,
      resourcePerson: null,
      price: 0,
      discountPrice: 0,
      modeOfEvent: null,
      startDateTimeOfEvent: null,
      endDateTimeOfEvent: null,
      lastDayToRegister: null,
      posterUrl: null,
      accessLevel: null,
      venue: null,
      availableSeats: null,
      err_clubId: null,
      err_name: null,
      err_resourcePerson: null,
      err_price: null,
      err_discountPrice: null,
      err_modeOfEvent: null,
      err_startDateTimeOfEvent: null,
      err_endDateTimeOfEvent: null,
      err_lastDayToRegister: null,
      err_posterUrl: null,
      err_accessLevel: null,
      err_venue: null,
      err_availableSeats: null,
    }
  ])
  function onChangeClubId(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['clubId'] = event.value
      _data['err_clubId'] = `ClubId is required`
      setData([_data])
    }
    else {
      _data['clubId'] = event.value
      _data['err_clubId'] = ''
      setData([_data])
    }
  }
  function onChangeHandle(event) {
    var _data = data[0]
    if (event.target.value === '') {
      _data[event.target.id] = event.target.value
      _data['err_' + event.target.id] = `${event.target.id} is required`
      setData([_data])
    }
    else {
      _data[event.target.id] = event.target.value
      _data['err_' + event.target.id] = ''
      setData([_data])
    }
    console.log(data[0])
  }
  function readImageFile(eve) {
    if (eve.target.files.length > 0) {
      var uplodedFile = eve.target.files[0]
      var reader = new FileReader();
      reader.onloadend = function (e) {
        let _data = data[0]
        _data[eve.target.id] = e.target.result
        _data[`err_${eve.target.id}`] = ''
        setData([_data])
      }
      reader.readAsDataURL(uplodedFile);
    }
    console.log(data[0]);
  }
  function submitForm() {
    if (data[0].err_clubId === '' &&
      data[0].err_name === '' &&
      data[0].err_resourcePerson === '' &&
      data[0].err_price === '' &&
      data[0].err_discountPrice === '' &&
      data[0].err_modeOfEvent === '' &&
      data[0].err_startDateTimeOfEvent === '' &&
      data[0].err_endDateTimeOfEvent === '' &&
      data[0].err_lastDayToRegister === '' &&
      data[0].err_posterUrl === '' &&
      data[0].err_accessLevel === '' &&
      data[0].err_venue === '' &&
      data[0].err_availableSeats === '') {
      authService.getAccessToken().then(token => {
        authService.getUser().then(user => {
          axios.post(`collegeevents/${user.name}`, {
            clubId: parseInt(data[0].clubId),
            name: data[0].name,
            resourcePerson: data[0].resourcePerson,
            price: parseFloat(data[0].price),
            discountPrice: parseFloat(data[0].discountPrice),
            modeOfEvent: data[0].modeOfEvent,
            startDateTimeOfEvent: data[0].startDateTimeOfEvent,
            endDateTimeOfEvent: data[0].endDateTimeOfEvent,
            lastDayToRegister: data[0].lastDayToRegister,
            pictureUrl: data[0].pictureUrl,
            posterUrl: data[0].posterUrl,
            accessLevel: data[0].accessLevel,
            venue: data[0].venue,
            availableSeats: parseInt(data[0].availableSeats),
            clubs: {
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
          ).then((response) => {
            navigate('/college-events-index-view')
          }
          ).catch((error) => {
            console.log(error.response.data);
          })
        })
      }
      )
    }
    else {
      alert('Invalid Data Entered');
    }
  }
  return (
    <React.Fragment>
      {data.map((data) => {
        return (
          <React.Fragment key={data.eventId}>
            <h1>Create</h1>
            <h4>CollegeEvents</h4>
            <hr />
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="clubId" options={clubData} placeholder='Organizing Club' onChange={onChangeClubId} required />
                  <span className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <input id="name" placeholder="Event Name" className="form-control" onChange={onChangeHandle} />
                  <span htmlFor="name" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" className="form-control" onChange={onChangeHandle}></textarea>
                  <span htmlFor="resourcePerson" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="price" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="discountPrice" className="text-danger"></span>
                </div><br />
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <input id="modeOfEvent" placeholder='Mode Of Event' className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="modeOfEvent" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="startDateTimeOfEvent" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="endDateTimeOfEvent" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="lastDayToRegister" className="text-danger"></span>
                </div><br />
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <input id="accessLevel" placeholder='Access Level' className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="accessLevel" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <textarea id="venue" placeholder='Venue' className="form-control" onChange={onChangeHandle} required ></textarea>
                  <span htmlFor="venue" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" className="form-control" min="0" onChange={onChangeHandle} required />
                  <span htmlFor="availableSeats" className="text-danger"></span>
                </div><br />
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Event Display Picture</label>&nbsp;
                  <label htmlFor="pictureUrl">
                    <img type="image" src="https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Edit-Button_ybm8jc.png" alt="Edit Button" height="30px" width="30px" />
                  </label>
                  <input id="pictureUrl" type="file" accept="image/*" onChange={readImageFile} height="10px" width="10px" hidden required />
                  <img className='image-display' src={data.pictureUrl} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Event Poster </label>&nbsp;
                  <label htmlFor="posterUrl">
                    <br /><img type="image" src="https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Edit-Button_ybm8jc.png" alt="Edit Button" height="30px" width="30px" />
                  </label>
                  <input id="posterUrl" type="file" accept="image/*" onChange={readImageFile} height="10px" width="10px" hidden required />
                  <br /><img className='image-display' src={data.posterUrl} />
                </div>
              </div>

              <div className="form-group" style={{ textAlign: 'right' }}>
                <button onClick={submitForm} className="btn btn-success" >Create</button>&nbsp;
                <Link className='btn btn-warning' to="/college-events-index-view">Back to List</Link>
              </div>
            </div>

          </React.Fragment>
        )
      }
      )}
    </React.Fragment >
  )
}
export function CollegeEventsEditView() {
  return (
    <div>CollegeEventsViews</div>
  )
}
export function CollegeEventsDetailsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState(null)
  const [clubData, setClubData] = useState(null)
  const queryParameters = new URLSearchParams(location.search)
  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get(`clubs`, {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((res) => {
        let _data = {}
        res.data.map((val) => {
          _data[val.clubId] = val.name
        })
        setClubData(_data)
        axios.get(`collegeevents/${queryParameters.get('id')}`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          setData(response.data)
          setSpinner(false)
        }).catch((error) => {
          console.log(error.response.data);
        })
      }).catch((error) => {
        console.log(error.response.data);
      })
    })
  }, [])
  return (
    <React.Fragment>
      <h1>Details</h1>
      {spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> : <React.Fragment>
        <div>
          <div >
            <h4>CollegeEvents</h4>
            <p style={{ textAlign: 'right' }}>
              <Link className='btn btn-warning' to={"/college-events-edit-view?id=" + data.eventId} >Edit</Link> &nbsp;
              <Link className='btn btn-primary' to="/college-events-index-view" >Back to List</Link>
            </p>
          </div>
          <hr />
          <dl className="row">
            <dt className="col-sm-2">
              EventId
            </dt>
            <dd className="col-sm-10">
              {data.eventId}
            </dd>
            <dt className="col-sm-2">
              Event Name
            </dt>
            <dd className="col-sm-10">
              {data.name}
            </dd>
            <dt className="col-sm-2">
              Origanizing Club
            </dt>
            <dd className="col-sm-10">
              {clubData[data.clubId]}
            </dd>
            <dt className="col-sm-2">
              ResourcePerson
            </dt>
            <dd className="col-sm-10">
              {data.resourcePerson}
            </dd>
            <dt className="col-sm-2">
              Price
            </dt>
            <dd className="col-sm-10">
              {data.price}
            </dd>
            <dt className="col-sm-2">
              DiscountPrice
            </dt>
            <dd className="col-sm-10">
              {data.discountPrice}
            </dd>
            <dt className="col-sm-2">
              ModeOfEvent
            </dt>
            <dd className="col-sm-10">
              {data.modeOfEvent}
            </dd>
            <dt className="col-sm-2">
              StartDateTimeOfEvent
            </dt>
            <dd className="col-sm-10">
              {data.startDateTimeOfEvent}
            </dd>
            <dt className="col-sm-2">
              EndDateTimeOfEvent
            </dt>
            <dd className="col-sm-10">
              {data.endDateTimeOfEvent}
            </dd>
            <dt className="col-sm-2">
              LastDayToRegister
            </dt>
            <dd className="col-sm-10">
              {data.lastDayToRegister}
            </dd>
            <dt className="col-sm-2">
              AccessLevel
            </dt>
            <dd className="col-sm-10">
              {data.accessLevel}
            </dd>
            <dt className="col-sm-2">
              Venue
            </dt>
            <dd className="col-sm-10">
              {data.venue}
            </dd>
            <dt className="col-sm-2">
              AvailableSeats
            </dt>
            <dd className="col-sm-10">
              {data.availableSeats}
            </dd>
            <dt className="col-sm-2">
              Event Picture
            </dt>
            <dd className="col-sm-10">
              <img className='image-display' src={data.pictureUrl} alt="" />
            </dd>
            <dt className="col-sm-2">
              Poster
            </dt>
            <dd className="col-sm-10">
              <img className='image-display' src={data.posterUrl} alt="" />
            </dd>
          </dl>
        </div>
      </React.Fragment>}

    </React.Fragment>
  )
}

