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
        <h1>College Events</h1>
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
                    >Delete</button> |&nbsp;
                    <Link className='btn btn-dark' to={"/event-registrations-index-view?id=" + val.eventId+"&returnUrl=/college-events-index-view"}>Event Registrations</Link>
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
  var AccessLevelOptions = [
    { value: "Student", label: "Students" },
    { value: "Member", label: "Everyone" },
  ]
  var ModeOfEventOptions = [
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ]
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
      _data['err_clubId'] = `Club Id is required`
      setData([_data])
    }
    else {
      _data['clubId'] = event.value
      _data['err_clubId'] = ''
      setData([_data])
    }
  }
  function onChangeModeOfEvent(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = `Mode Of Event is required`
      setData([_data])
    }
    else {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = ''
      setData([_data])
    }
  }
  function onChangeAccessLevel(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = `Access Level is required`
      setData([_data])
    }
    else {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = ''
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
            <h4>College Events</h4>
            <hr />
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="clubId" options={clubData} placeholder='Organizing Club' onChange={onChangeClubId} required />
                  <span className="text-danger">{data.err_clubId}</span>
                </div><br />
                <div className="form-group">
                  <input id="name" placeholder="Event Name" className="form-control" onChange={onChangeHandle} />
                  <span htmlFor="name" className="text-danger">{data.err_name}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" className="form-control" onChange={onChangeHandle}></textarea>
                  <span htmlFor="resourcePerson" className="text-danger">{data.err_resourcePerson}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="price" className="text-danger">{data.err_price}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="discountPrice" className="text-danger">{data.err_discountPrice}</span>
                </div><br />
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="modeOfEvent" options={ModeOfEventOptions} placeholder='Mode Of Event' onChange={onChangeModeOfEvent} required />
                  <span htmlFor="modeOfEvent" className="text-danger">{data.err_modeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="startDateTimeOfEvent" className="text-danger">{data.err_startDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="endDateTimeOfEvent" className="text-danger">{data.err_endDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="lastDayToRegister" className="text-danger">{data.err_lastDayToRegister}</span>
                </div><br />
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Select id="modeOfEvent" options={AccessLevelOptions} placeholder='Access Level' onChange={onChangeAccessLevel} required />
                  <span htmlFor="accessLevel" className="text-danger">{data.err_accessLevel}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="venue" placeholder='Venue' className="form-control" onChange={onChangeHandle} required ></textarea>
                  <span htmlFor="venue" className="text-danger">{data.err_venue}</span>
                </div><br />
                <div className="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" className="form-control" min="0" onChange={onChangeHandle} required />
                  <span htmlFor="availableSeats" className="text-danger">{data.err_availableSeats}</span>
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
  const navigate = useNavigate()
  const location = useLocation()
  const [spinner, setSpinner] = useState(true);
  const queryParameters = new URLSearchParams(location.search)
  var AccessLevelOptions = [
    { value: "Student", label: "Students" },
    { value: "Member", label: "Everyone" },
  ]
  var ModeOfEventOptions = [
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ]
  const [clubData, setClubData] = useState(null)
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
  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get('clubs', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        let _list = {}
        response.data.map((val) => {
          _list[val.clubId] = Object.assign({ value: val.clubId, label: val.name })
        }
        )
        setClubData(_list)
        axios.get(`collegeevents/${queryParameters.get('id')}`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          let _data=response.data
          _data.err_clubId= ''
          _data.err_name= ''
          _data.err_resourcePerson=''
          _data.err_price= ''
          _data.err_discountPrice= ''
          _data.err_modeOfEvent= ''
          _data.err_startDateTimeOfEvent= ''
          _data.err_endDateTimeOfEvent= ''
          _data.err_lastDayToRegister= ''
          _data.err_posterUrl= ''
          _data.err_accessLevel= ''
          _data.err_venue= ''
          _data.err_availableSeats= ''
          setData([_data])
          setSpinner(false)
        })
      }).catch((error) => {
        console.log(error.response.data);
      })
    })
  }, [])
  function onChangeClubId(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['clubId'] = event.value
      _data['err_clubId'] = `Club Id is required`
      setData([_data])
    }
    else {
      _data['clubId'] = event.value
      _data['err_clubId'] = ''
      setData([_data])
    }
  }
  function onChangeModeOfEvent(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = `Mode Of Event is required`
      setData([_data])
    }
    else {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = ''
      setData([_data])
    }
  }
  function onChangeAccessLevel(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = `Access Level is required`
      setData([_data])
    }
    else {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = ''
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
          axios.put(`collegeevents/${user.name}/${queryParameters.get('id')}`, {
            eventId: data[0].eventId,
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
           spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
          <React.Fragment key={data.eventId}>
            <h1>Edit</h1>
            <h4>College Events</h4>
            <hr />
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="clubId" options={Object.values(clubData)} placeholder='Organizing Club' onChange={onChangeClubId}  defaultValue={{ label: clubData[data.clubId].label, value:data.clubId}} required/>
                  <span className="text-danger">{data.err_clubId}</span>
                </div><br />
                <div className="form-group">
                  <input id="name" placeholder="Event Name" className="form-control" onChange={onChangeHandle} required value={data.name}/>
                  <span htmlFor="name" className="text-danger">{data.err_name}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" className="form-control" onChange={onChangeHandle}>{data.resourcePerson}</textarea>
                  <span htmlFor="resourcePerson" className="text-danger">{data.err_resourcePerson}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} value={data.price} required />
                  <span htmlFor="price" className="text-danger">{data.err_price}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" onChange={onChangeHandle} value={data.discountPrice} required />
                  <span htmlFor="discountPrice" className="text-danger">{data.err_discountPrice}</span>
                </div><br />
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="modeOfEvent" options={ModeOfEventOptions} placeholder='Mode Of Event' onChange={onChangeModeOfEvent} defaultValue={{ label: data.modeOfEvent, value:data.modeOfEvent}}  required />
                  <span htmlFor="modeOfEvent" className="text-danger">{data.err_modeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.startDateTimeOfEvent} required />
                  <span htmlFor="startDateTimeOfEvent" className="text-danger">{data.err_startDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.endDateTimeOfEvent} required />
                  <span htmlFor="endDateTimeOfEvent" className="text-danger">{data.err_endDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.lastDayToRegister} required />
                  <span htmlFor="lastDayToRegister" className="text-danger">{data.err_lastDayToRegister}</span>
                </div><br />
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Select id="modeOfEvent" options={AccessLevelOptions} placeholder='Access Level' onChange={onChangeAccessLevel} defaultValue={{ label: data.accessLevel==='Student'?'Students':'Everyone', value:data.accessLevel}} required />
                  <span htmlFor="accessLevel" className="text-danger">{data.err_accessLevel}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="venue" placeholder='Venue' className="form-control" onChange={onChangeHandle} value={data.venue} required ></textarea>
                  <span htmlFor="venue" className="text-danger">{data.err_venue}</span>
                </div><br />
                <div className="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" className="form-control" min="0" onChange={onChangeHandle} value={data.availableSeats} required />
                  <span htmlFor="availableSeats" className="text-danger">{data.err_availableSeats}</span>
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
                <button onClick={submitForm} className="btn btn-success" >Save</button>&nbsp;
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
export function CollegeEventsPresidentView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [clubData, setClubData] = useState(null)
  const [spinner, setSpinner] = useState(true);
  useEffect(() => {
    authService.getAccessToken().then(token => {
      authService.getUser().then(user => {
        axios.get('clubs', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          let _data = {}
          response.data.map((val) => {
            if(String(val.president).split('@')[0]===user.name){
              _data[val.clubId] = val.name
            }
          })
          setClubData(_data)
          axios.get('collegeevents', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }).then((res) => {
            setData(res.data)
            setSpinner(false)
          })
        })
      }).catch((error) => {
        console.log(error);
      })
    })

  }, [data])
  return (
    spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
      <React.Fragment>
        <h1>College Events</h1>
        <p style={{ textAlign: 'right' }}>
          <Link className='btn btn-success' to="/college-events-president-create-view">+ Create New</Link>&nbsp;
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
                Mode of Event
              </th>
              <th>
                Date of Event
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
              return (clubData[val.clubId]?
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
                    <Link className='btn btn-primary' to={"/college-events-president-edit-view?id=" + val.eventId}>Edit</Link> |&nbsp;
                    <Link className='btn btn-warning' to={"/college-events-president-details-view?id=" + val.eventId}>Details</Link> |&nbsp;
                    <button className='btn btn-danger'
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this Event (` + val.name + ")?")) {
                          authService.getAccessToken().then(token => {
                            authService.getUser().then(user => {

                              axios.delete(`collegeevents/${user.name}/${val.eventId}`, {
                                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                              }).then((response) => {
                                navigate("/college-events-president-view");
                              }).catch((error) => {
                                console.log(error)
                              })
                            })
                          })
                        }
                      }}
                    >Delete</button> |&nbsp;
                    <Link className='btn btn-dark' to={"/event-registrations-index-view?id=" + val.eventId}>Event Registrations</Link>
                  </td>
                </tr>:<React.Fragment></React.Fragment>
              )
            })}
          </tbody>
        </table>

      </React.Fragment>
  )
}
export function CollegeEventsPresidentCreateView() {
  const navigate = useNavigate()
  var AccessLevelOptions = [
    { value: "Student", label: "Students" },
    { value: "Member", label: "Everyone" },
  ]
  var ModeOfEventOptions = [
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ]
  const [clubData, setClubData] = useState(null)
  useEffect(() => {
    authService.getAccessToken().then(token => {
      authService.getUser().then(user => {
        axios.get('clubs', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          let _list = []
          response.data.map((val) => {
            if(String(val.president).split('@')[0]===user.name){
            _list.push({ value: val.clubId, label: val.name })
            }
          }
          )
          setClubData(_list)
        }).catch((error) => {
          console.log(error.response.data);
        })
      }).catch((error) => {
        console.log(error);
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
      _data['err_clubId'] = `Club Id is required`
      setData([_data])
    }
    else {
      _data['clubId'] = event.value
      _data['err_clubId'] = ''
      setData([_data])
    }
  }
  function onChangeModeOfEvent(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = `Mode Of Event is required`
      setData([_data])
    }
    else {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = ''
      setData([_data])
    }
  }
  function onChangeAccessLevel(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = `Access Level is required`
      setData([_data])
    }
    else {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = ''
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
            navigate('/college-events-president-view')
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
            <h4>College Events</h4>
            <hr />
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="clubId" options={clubData} placeholder='Organizing Club' onChange={onChangeClubId} required />
                  <span className="text-danger">{data.err_clubId}</span>
                </div><br />
                <div className="form-group">
                  <input id="name" placeholder="Event Name" className="form-control" onChange={onChangeHandle} />
                  <span htmlFor="name" className="text-danger">{data.err_name}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" className="form-control" onChange={onChangeHandle}></textarea>
                  <span htmlFor="resourcePerson" className="text-danger">{data.err_resourcePerson}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="price" className="text-danger">{data.err_price}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" onChange={onChangeHandle} required />
                  <span htmlFor="discountPrice" className="text-danger">{data.err_discountPrice}</span>
                </div><br />
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="modeOfEvent" options={ModeOfEventOptions} placeholder='Mode Of Event' onChange={onChangeModeOfEvent} required />
                  <span htmlFor="modeOfEvent" className="text-danger">{data.err_modeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="startDateTimeOfEvent" className="text-danger">{data.err_startDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="endDateTimeOfEvent" className="text-danger">{data.err_endDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" className="form-control" onChange={onChangeHandle} required />
                  <span htmlFor="lastDayToRegister" className="text-danger">{data.err_lastDayToRegister}</span>
                </div><br />
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Select id="modeOfEvent" options={AccessLevelOptions} placeholder='Access Level' onChange={onChangeAccessLevel} required />
                  <span htmlFor="accessLevel" className="text-danger">{data.err_accessLevel}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="venue" placeholder='Venue' className="form-control" onChange={onChangeHandle} required ></textarea>
                  <span htmlFor="venue" className="text-danger">{data.err_venue}</span>
                </div><br />
                <div className="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" className="form-control" min="0" onChange={onChangeHandle} required />
                  <span htmlFor="availableSeats" className="text-danger">{data.err_availableSeats}</span>
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
                <Link className='btn btn-warning' to="/college-events-president-view">Back to List</Link>
              </div>
            </div>

          </React.Fragment>
        )
      }
      )}
    </React.Fragment >
  )
}
export function CollegeEventsPresidentEditView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [spinner, setSpinner] = useState(true);
  const queryParameters = new URLSearchParams(location.search)
  var AccessLevelOptions = [
    { value: "Student", label: "Students" },
    { value: "Member", label: "Everyone" },
  ]
  var ModeOfEventOptions = [
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ]
  const [clubData, setClubData] = useState(null)
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
  useEffect(() => {
    authService.getAccessToken().then(token => {
      authService.getUser().then(user => {
        axios.get('clubs', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          let _list = {}
          response.data.map((val) => {
            if(String(val.president).split('@')[0]===user.name){
            _list[val.clubId] = Object.assign({ value: val.clubId, label: val.name })
            }
          }
          )
          setClubData(_list)
          axios.get(`collegeevents/${queryParameters.get('id')}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
          }).then((response) => {
            let _data=response.data
            _data.err_clubId= ''
            _data.err_name= ''
            _data.err_resourcePerson=''
            _data.err_price= ''
            _data.err_discountPrice= ''
            _data.err_modeOfEvent= ''
            _data.err_startDateTimeOfEvent= ''
            _data.err_endDateTimeOfEvent= ''
            _data.err_lastDayToRegister= ''
            _data.err_posterUrl= ''
            _data.err_accessLevel= ''
            _data.err_venue= ''
            _data.err_availableSeats= ''
            setData([_data])
            setSpinner(false)
          })
        }).catch((error) => {
          console.log(error);
        })
      }).catch((error) => {
        console.log(error);
      })
    })
  }, [])
  function onChangeClubId(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['clubId'] = event.value
      _data['err_clubId'] = `Club Id is required`
      setData([_data])
    }
    else {
      _data['clubId'] = event.value
      _data['err_clubId'] = ''
      setData([_data])
    }
  }
  function onChangeModeOfEvent(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = `Mode Of Event is required`
      setData([_data])
    }
    else {
      _data['modeOfEvent'] = event.value
      _data['err_modeOfEvent'] = ''
      setData([_data])
    }
  }
  function onChangeAccessLevel(event) {
    var _data = data[0]
    if (event.value === '') {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = `Access Level is required`
      setData([_data])
    }
    else {
      _data['accessLevel'] = event.value
      _data['err_accessLevel'] = ''
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
          axios.put(`collegeevents/${user.name}/${queryParameters.get('id')}`, {
            eventId: data[0].eventId,
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
            navigate('/college-events-president-view')
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
           spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
          <React.Fragment key={data.eventId}>
            <h1>Edit</h1>
            <h4>College Events</h4>
            <hr />
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="clubId" options={Object.values(clubData)} placeholder='Organizing Club' onChange={onChangeClubId}  defaultValue={{ label: clubData[data.clubId].label, value:data.clubId}} required/>
                  <span className="text-danger">{data.err_clubId}</span>
                </div><br />
                <div className="form-group">
                  <input id="name" placeholder="Event Name" className="form-control" onChange={onChangeHandle} required value={data.name}/>
                  <span htmlFor="name" className="text-danger">{data.err_name}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" className="form-control" onChange={onChangeHandle}>{data.resourcePerson}</textarea>
                  <span htmlFor="resourcePerson" className="text-danger">{data.err_resourcePerson}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} value={data.price} required />
                  <span htmlFor="price" className="text-danger">{data.err_price}</span>
                </div><br />
                <div className="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" onChange={onChangeHandle} value={data.discountPrice} required />
                  <span htmlFor="discountPrice" className="text-danger">{data.err_discountPrice}</span>
                </div><br />
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <Select id="modeOfEvent" options={ModeOfEventOptions} placeholder='Mode Of Event' onChange={onChangeModeOfEvent} defaultValue={{ label: data.modeOfEvent, value:data.modeOfEvent}}  required />
                  <span htmlFor="modeOfEvent" className="text-danger">{data.err_modeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.startDateTimeOfEvent} required />
                  <span htmlFor="startDateTimeOfEvent" className="text-danger">{data.err_startDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.endDateTimeOfEvent} required />
                  <span htmlFor="endDateTimeOfEvent" className="text-danger">{data.err_endDateTimeOfEvent}</span>
                </div><br />
                <div className="form-group">
                  <label className="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" className="form-control" onChange={onChangeHandle} value={data.lastDayToRegister} required />
                  <span htmlFor="lastDayToRegister" className="text-danger">{data.err_lastDayToRegister}</span>
                </div><br />
              </div>
              <div className='col-md-3'>
                <div className="form-group">
                  <Select id="modeOfEvent" options={AccessLevelOptions} placeholder='Access Level' onChange={onChangeAccessLevel} defaultValue={{ label: data.accessLevel==='Student'?'Students':'Everyone', value:data.accessLevel}} required />
                  <span htmlFor="accessLevel" className="text-danger">{data.err_accessLevel}</span>
                </div><br />
                <div className="form-group">
                  <textarea id="venue" placeholder='Venue' className="form-control" onChange={onChangeHandle} value={data.venue} required ></textarea>
                  <span htmlFor="venue" className="text-danger">{data.err_venue}</span>
                </div><br />
                <div className="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" className="form-control" min="0" onChange={onChangeHandle} value={data.availableSeats} required />
                  <span htmlFor="availableSeats" className="text-danger">{data.err_availableSeats}</span>
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
                <button onClick={submitForm} className="btn btn-success" >Save</button>&nbsp;
                <Link className='btn btn-warning' to="/college-events-president-view">Back to List</Link>
              </div>
            </div>

          </React.Fragment>
        )
      }
      )}
    </React.Fragment >
  )
}
export function CollegeEventsPresidentDetailsView() {
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
              <Link className='btn btn-warning' to={"/college-events-president-edit-view?id=" + data.eventId} >Edit</Link> &nbsp;
              <Link className='btn btn-primary' to="/college-events-president-view" >Back to List</Link>
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
